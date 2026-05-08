// @ts-nocheck
"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "../types/schema";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

// Fetch function that routes to Supabase for data
async function supabaseFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const request = new Request(input, init);
  const url = new URL(request.url);
  const path = url.pathname.replace("/api", "");
  const method = request.method.toUpperCase();
  
  const supabase = createSupabaseClient();

  // Simulate small delay for consistency
  await new Promise((resolve) => setTimeout(resolve, 50));

  let responseData: unknown = null;
  let status = 200;

  // GET /v1/student_athletes - list all athletes
  if (method === "GET" && path === "/v1/student_athletes") {
    const { data, error } = await supabase
      .from("athletes")
      .select("*")
      .order("last_name", { ascending: true });
    
    if (error) {
      status = 500;
      responseData = { error: error.message };
    } else {
      // Map database fields to expected API format
      responseData = { 
        data: (data || []).map(athlete => ({
          uuid: athlete.id,
          first_name: athlete.first_name,
          last_name: athlete.last_name,
          sport: athlete.sport,
          university: athlete.university,
          class_year: athlete.class_year,
          email: athlete.email,
          phone: athlete.phone,
          status: athlete.status,
          created_at: athlete.created_at,
          updated_at: athlete.updated_at,
        }))
      };
    }
  }
  // GET /v1/student_athletes/{uuid} - get single athlete
  else if (method === "GET" && path.match(/^\/v1\/student_athletes\/[^/]+$/)) {
    const uuid = path.split("/").pop();
    const { data: athlete, error } = await supabase
      .from("athletes")
      .select("*")
      .eq("id", uuid)
      .single();
    
    if (error || !athlete) {
      status = 404;
      responseData = { error: "Athlete not found" };
    } else {
      // Get agreements for this athlete
      const { data: agreements } = await supabase
        .from("agreements")
        .select(`
          *,
          sponsor:sponsors(*),
          campaign:campaigns(*)
        `)
        .eq("athlete_id", uuid);

      responseData = {
        uuid: athlete.id,
        first_name: athlete.first_name,
        last_name: athlete.last_name,
        sport: athlete.sport,
        university: athlete.university,
        university_id: athlete.university_id,
        agent_id: athlete.agent_id,
        class_year: athlete.class_year,
        graduation_year: athlete.class_year,
        email: athlete.email,
        edu_email: athlete.email, // Map to edu_email for UI compatibility
        secondary_email: null, // DB only has one email field
        phone: athlete.phone,
        preferred_phone: athlete.phone ? { phone_number: athlete.phone, type: "mobile" } : null,
        status: athlete.status,
        created_at: athlete.created_at,
        updated_at: athlete.updated_at,
        threads: (agreements || []).map(a => ({
          uuid: a.id,
          name: a.sponsor?.name || "Agreement",
          type: a.type,
          status: a.status,
          value_cents: a.amount_cents,
          start_date: a.start_date,
          end_date: a.end_date,
        })),
      };
    }
  }
  // GET /v1/student_athletes/list - dropdown list
  else if (method === "GET" && path === "/v1/student_athletes/list") {
    const { data, error } = await supabase
      .from("athletes")
      .select("id, first_name, last_name")
      .order("last_name", { ascending: true });
    
    if (error) {
      status = 500;
      responseData = { error: error.message };
    } else {
      responseData = (data || []).map((a) => ({
        value: a.id,
        label: `${a.last_name}, ${a.first_name}`,
      }));
    }
  }
  // POST /v1/student_athletes - create athlete
  else if (method === "POST" && path === "/v1/student_athletes") {
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      // No body
    }

    const { data: athlete, error } = await supabase
      .from("athletes")
      .insert({
        first_name: body.first_name as string,
        last_name: body.last_name as string,
        sport: body.sport as string,
        university: body.university as string || null,
        university_id: body.university_id as string || null,
        agent_id: body.agent_id as string || null,
        class_year: body.graduation_year ? parseInt(body.graduation_year as string) : null,
        email: body.secondary_email as string || body.edu_email as string || null,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      status = 500;
      responseData = { error: error.message };
    } else {
      responseData = {
        uuid: athlete.id,
        first_name: athlete.first_name,
        last_name: athlete.last_name,
        sport: athlete.sport,
        university: athlete.university,
        university_id: athlete.university_id,
        agent_id: athlete.agent_id,
        class_year: athlete.class_year,
        email: athlete.email,
        status: athlete.status,
        created_at: athlete.created_at,
      };
      status = 201;
    }
  }
  // PATCH /v1/student_athletes/{uuid} - update athlete
  else if (method === "PATCH" && path.match(/^\/v1\/student_athletes\/[^/]+$/)) {
    const uuid = path.split("/").pop();
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      // No body
    }

    const updateData: Record<string, unknown> = {};
    if (body.first_name !== undefined) updateData.first_name = body.first_name;
    if (body.last_name !== undefined) updateData.last_name = body.last_name;
    if (body.sport !== undefined) updateData.sport = body.sport;
    if (body.university !== undefined) updateData.university = body.university;
    // Handle both email field names (from form: edu_email/secondary_email, direct: email)
    // Prioritize edu_email, fallback to secondary_email, then email
    if (body.edu_email !== undefined) {
      updateData.email = body.edu_email || null;
    } else if (body.secondary_email !== undefined) {
      updateData.email = body.secondary_email || null;
    } else if (body.email !== undefined) {
      updateData.email = body.email;
    }
    // Handle both phone field names (from form: phone_number, direct: phone)
    if (body.phone_number !== undefined) {
      updateData.phone = body.phone_number;
    } else if (body.phone !== undefined) {
      updateData.phone = body.phone;
    }
    if (body.status !== undefined) updateData.status = body.status;
    // Handle graduation year -> class_year mapping
    if (body.graduation_year !== undefined) {
      updateData.class_year = body.graduation_year ? parseInt(body.graduation_year as string) : null;
    }
    // Handle agent_id
    if (body.agent_id !== undefined) {
      updateData.agent_id = body.agent_id || null;
    }
    // Handle university_id (convert from university name to ID if needed)
    if (body.university_id !== undefined) {
      updateData.university_id = body.university_id || null;
    }

    const { data: athlete, error } = await supabase
      .from("athletes")
      .update(updateData)
      .eq("id", uuid)
      .select()
      .single();

    if (error) {
      status = 500;
      responseData = { error: error.message };
    } else {
      responseData = {
        uuid: athlete.id,
        first_name: athlete.first_name,
        last_name: athlete.last_name,
        sport: athlete.sport,
        university: athlete.university,
        university_id: athlete.university_id,
        agent_id: athlete.agent_id,
        class_year: athlete.class_year,
        graduation_year: athlete.class_year,
        email: athlete.email,
        edu_email: athlete.email,
        secondary_email: null,
        phone: athlete.phone,
        preferred_phone: athlete.phone ? { phone_number: athlete.phone, type: "mobile" } : null,
        status: athlete.status,
        updated_at: athlete.updated_at,
      };
    }
  }
  // DELETE /v1/student_athletes/{uuid}
  else if (method === "DELETE" && path.match(/^\/v1\/student_athletes\/[^/]+$/)) {
    const uuid = path.split("/").pop();
    const { error } = await supabase
      .from("athletes")
      .delete()
      .eq("id", uuid);

    if (error) {
      status = 500;
      responseData = { error: error.message };
    } else {
      responseData = { success: true };
      status = 204;
    }
  }
  // GET /v1/threads - list all agreements (mapped from old threads concept)
  else if (method === "GET" && path === "/v1/threads") {
    const { data, error } = await supabase
      .from("agreements")
      .select(`
        *,
        athlete:athletes(*),
        sponsor:sponsors(*),
        campaign:campaigns(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      status = 500;
      responseData = { error: error.message };
    } else {
      responseData = {
        data: (data || []).map(a => ({
          uuid: a.id,
          name: `${a.athlete?.first_name} ${a.athlete?.last_name} - ${a.sponsor?.name || 'Revenue Share'}`,
          type: a.type,
          status: a.status,
          value_cents: a.amount_cents,
          student_athlete: a.athlete ? {
            uuid: a.athlete.id,
            first_name: a.athlete.first_name,
            last_name: a.athlete.last_name,
          } : null,
          sponsor: a.sponsor,
          campaign: a.campaign,
          start_date: a.start_date,
          end_date: a.end_date,
          created_at: a.created_at,
        }))
      };
    }
  }
  // GET /v1/threads/stats
  else if (method === "GET" && path === "/v1/threads/stats") {
    const { data, error } = await supabase
      .from("agreements")
      .select("status");

    if (error) {
      responseData = { drafting: 0, draft_sent: 0, in_redlining: 0, ready_to_sign: 0, active: 0, executed: 0 };
    } else {
      const statuses = data || [];
      responseData = {
        drafting: statuses.filter(s => s.status === "draft").length,
        draft_sent: 0,
        in_redlining: 0,
        ready_to_sign: 0,
        active: statuses.filter(s => s.status === "active").length,
        executed: statuses.filter(s => s.status === "completed").length,
      };
    }
  }
  // GET /v1/agencies/list - return empty for now (agencies not in new model)
  else if (method === "GET" && path === "/v1/agencies/list") {
    responseData = [];
  }
  // Fallback for other endpoints
  else if (method === "GET") {
    responseData = { data: [] };
  }
  else if (method === "POST") {
    let body = {};
    try {
      body = await request.json();
    } catch {
      // No body
    }
    responseData = {
      uuid: `mock-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
    };
    status = 201;
  }
  else if (method === "PATCH") {
    let body = {};
    try {
      body = await request.json();
    } catch {
      // No body
    }
    const uuid = path.split("/").pop();
    responseData = {
      uuid,
      ...body,
      updated_at: new Date().toISOString(),
    };
  }
  else if (method === "DELETE") {
    responseData = { success: true };
    status = 204;
  }
  else {
    responseData = { data: [] };
  }

  return new Response(JSON.stringify(responseData), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

type ApiClientType = ReturnType<typeof createClient<paths>>;
const ApiContext = React.createContext<ApiClientType | null>(null);

function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
    [],
  );

  const apiClient = React.useMemo(() => {
    const fetchClient = createFetchClient<paths>({
      baseUrl: "/api",
      fetch: supabaseFetch,
    });

    return createClient(fetchClient);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function useApi() {
  const client = React.useContext(ApiContext);

  if (!client) {
    throw new Error("useApi must be used within QueryProvider");
  }

  return client;
}

export { useApi, QueryProvider };
