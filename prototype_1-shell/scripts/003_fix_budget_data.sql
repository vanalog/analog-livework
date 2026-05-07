-- Fix budget_types sport and category values to match what the UI expects
UPDATE budget_types SET sport = 'mbb', category = 'cap' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE budget_types SET sport = 'wbb', category = 'cap' WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE budget_types SET sport = 'mbb', category = 'nil' WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE budget_types SET sport = 'wbb', category = 'nil' WHERE id = '44444444-4444-4444-4444-444444444444';
