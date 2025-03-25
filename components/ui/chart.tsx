import React from "react"
import {
  AreaChart as RechartsAreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export { Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, Cell, Legend }

export const AreaChart = React.forwardRef<
  React.ElementRef<typeof RechartsAreaChart>,
  React.ComponentPropsWithoutRef<typeof RechartsAreaChart>
>(({ children, ...props }, ref) => (
  <RechartsAreaChart ref={ref} {...props}>
    {children}
  </RechartsAreaChart>
))
AreaChart.displayName = "AreaChart"

export const PieChart = React.forwardRef<
  React.ElementRef<typeof RechartsPieChart>,
  React.ComponentPropsWithoutRef<typeof RechartsPieChart>
>(({ children, ...props }, ref) => (
  <RechartsPieChart ref={ref} {...props}>
    {children}
  </RechartsPieChart>
))
PieChart.displayName = "PieChart"

