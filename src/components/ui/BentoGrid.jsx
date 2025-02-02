import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 md:row-span-2">
        <CardHeader>
          <CardTitle>Latest Materials</CardTitle>
          <CardDescription>Recently added study resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quick Notes</CardTitle>
          <CardDescription>Access your recent notes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded-lg" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>Track your learning progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}

