import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, X } from "lucide-react"
import { lowStockItems } from "@/lib/seed-data"

export function LowStockAlert() {
  return (
    <Card className="border-l-4 border-l-[#F59E0B]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
          Low Stock Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {lowStockItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
            >
              <span className="text-sm font-medium">{item.name}</span>
              <span
                className={`text-sm font-bold ${
                  item.stock === 0 ? "text-[#EF4444]" : "text-[#F59E0B]"
                }`}
              >
                {item.stock === 0 ? (
                  <span className="flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Out
                  </span>
                ) : (
                  `${item.stock} ${item.unit}`
                )}
              </span>
            </li>
          ))}
        </ul>
        <Link
          href="/backoffice/library/items"
          className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
        >
          View All Items
        </Link>
      </CardContent>
    </Card>
  )
}
