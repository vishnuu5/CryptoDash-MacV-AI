import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 font-medium text-muted-foreground">#</th>
                <th className="p-4 font-medium text-muted-foreground">Coin</th>
                <th className="p-4 font-medium text-muted-foreground text-right">
                  Price
                </th>
                <th className="p-4 font-medium text-muted-foreground text-right">
                  24h %
                </th>
                <th className="p-4 font-medium text-muted-foreground text-right hidden sm:table-cell">
                  Market Cap
                </th>
                <th className="p-4 font-medium text-muted-foreground text-right hidden md:table-cell">
                  Volume (24h)
                </th>
                <th className="p-4 font-medium text-muted-foreground text-center">
                  Watch
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="p-4">
                    <Skeleton className="h-4 w-8" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </td>
                  <td className="p-4 text-right">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </td>
                  <td className="p-4 text-right hidden sm:table-cell">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </td>
                  <td className="p-4 text-right hidden md:table-cell">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Skeleton className="h-8 w-8 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
