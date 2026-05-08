interface TrendArrowProps {
  value: number;
  increaseIsPositive: boolean;
}

function TrendArrow(props: TrendArrowProps) {
  if (props.value === 0) {
    return <span className="text-gray-500">—</span>;
  }

  const isIncrease = props.value > 0;
  const isPositive = isIncrease === props.increaseIsPositive;

  return (
    <span className={isPositive ? "text-green-600" : "text-red-600"}>
      {isIncrease ? "↑" : "↓"} {Math.abs(props.value)}
    </span>
  );
}

export { TrendArrow };
