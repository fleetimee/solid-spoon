import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            Manage your profile, view history, and adjust settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback> {/* Fallback initials */}
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">User Name</h3>{" "}
              {/* Placeholder */}
              <p className="text-sm text-muted-foreground">
                user.email@example.com
              </p>{" "}
              {/* Placeholder */}
            </div>
          </div>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Profile content goes here...</p>
                  {/* Add profile form or display components here */}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Booking History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>History content goes here...</p>
                  {/* Add history display components here */}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Settings content goes here...</p>
                  {/* Add settings form or components here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
