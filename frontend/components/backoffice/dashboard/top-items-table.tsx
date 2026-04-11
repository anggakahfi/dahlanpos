import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TopItemStat {
  product_name: string
  quantity_sold: number
  total_revenue: number
}

interface TopItemsTableProps {
  topItems: TopItemStat[]
  totalRevenue?: number
  isLoading?: boolean
}

export function TopItemsTable({ topItems, totalRevenue = 0, isLoading }: TopItemsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Top 10 Items</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Loading top items...
          </div>
        ) : topItems.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            No items sold
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topItems.map((item, index) => {
                const pctg = totalRevenue > 0 
                  ? ((item.total_revenue / totalRevenue) * 100).toFixed(1)
                  : "0.0"
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.product_name}</TableCell>
                    <TableCell className="text-right">{item.quantity_sold}</TableCell>
                    <TableCell className="text-right">
                      Rp {item.total_revenue.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right">
                      {pctg}%
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
