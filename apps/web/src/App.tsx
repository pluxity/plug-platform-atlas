import { Button, Badge, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, Alert, AlertTitle, AlertDescription, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@plug-atlas/ui'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Plug Platform Atlas</h1>
          <Badge variant="secondary">v1.0.0</Badge>
        </div>

        <Alert>
          <AlertTitle>Welcome!</AlertTitle>
          <AlertDescription>
            Your monorepo project with React 19, Vite, TypeScript, and Tailwind CSS v4 is ready!
          </AlertDescription>
        </Alert>

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>UI Components</CardTitle>
            <CardDescription>
              Essential components organized with atomic design pattern
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="flex gap-2">
              <Button>Primary</Button>
              <Button variant="outline">Outline</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hello from Dialog!</DialogTitle>
                    <DialogDescription>
                      This dialog is working perfectly with our atomic design components.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App