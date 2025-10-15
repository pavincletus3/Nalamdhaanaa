import React, { ReactNode } from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: "teal" | "emerald" | "cyan" | "slate";
  action?: ReactNode;
  children?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const colorClasses = {
  teal: "bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 border-teal-200",
  emerald:
    "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 border-emerald-200",
  cyan: "bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-600 border-cyan-200",
  slate:
    "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 border-slate-200",
};

const Card: React.FC<CardProps> = ({
  title,
  value,
  icon,
  color,
  action,
  children,
  trend,
  className = "",
}) => {
  return (
    <div className={`card-interactive p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-4 rounded-2xl border ${colorClasses[color]} shadow-sm`}
        >
          {icon}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div
              className={`flex items-center text-sm font-medium ${
                trend.isPositive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              <span
                className={`inline-block w-0 h-0 mr-1 ${
                  trend.isPositive
                    ? "border-l-2 border-r-2 border-b-2 border-l-transparent border-r-transparent border-b-emerald-600"
                    : "border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-red-600"
                }`}
              ></span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </div>

      {children && (
        <div className="mt-6 pt-4 border-t border-gray-100">{children}</div>
      )}
    </div>
  );
};

export default Card;
