import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Book, Brain, Lightbulb, Users } from "lucide-react"

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <Book className="w-8 h-8 mb-2 text-primary" />
          <CardTitle>Study Materials</CardTitle>
          <CardDescription>Access comprehensive study resources and materials</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Organized collection of notes, textbooks, and reference materials
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Brain className="w-8 h-8 mb-2 text-primary" />
          <CardTitle>Smart Learning</CardTitle>
          <CardDescription>Personalized learning paths and progress tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Adaptive learning system that grows with your progress</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Users className="w-8 h-8 mb-2 text-primary" />
          <CardTitle>Study Groups</CardTitle>
          <CardDescription>Connect and collaborate with fellow students</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Join study groups and participate in collaborative learning</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Lightbulb className="w-8 h-8 mb-2 text-primary" />
          <CardTitle>Practice Tests</CardTitle>
          <CardDescription>Test your knowledge with practice exams</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Comprehensive practice tests with detailed explanations</p>
        </CardContent>
      </Card>
    </div>
  )
}

