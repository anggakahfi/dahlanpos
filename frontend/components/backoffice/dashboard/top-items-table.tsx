import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { topItems } from "@/lib/seed-data"

export function TopItemsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Top 10 Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Sold</TableHead>
              <TableHead className="text-right">Gross Sales</TableHead>
              <TableHead className="text-right">Net Sales</TableHead>
              <TableHead className="text-right">Gross Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">{item.sold}</TableCell>
                <TableCell className="text-right">
                  Rp {item.grossSales.toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="text-right">
                  Rp {item.netSales.toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="text-right">
                  Rp {item.grossProfit.toLocaleString('id-ID')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
