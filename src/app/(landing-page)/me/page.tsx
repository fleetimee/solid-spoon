import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "My Profile" }, // Current page, no href
  ];

  return (
    <>
      <BreadcrumbSetter items={breadcrumbItems} />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-16 pt-8">
        {/* Profile cover and header */}
        <div className="relative mb-20">
          <div className="w-full h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl"></div>
          <div className="absolute -bottom-12 left-6 flex items-end space-x-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src="/placeholder.svg" alt="User Avatar" />
              <AvatarFallback className="text-xl">JD</AvatarFallback>
            </Avatar>
            <div className="pb-2 hidden sm:block">
              <div className="bg-black/50 px-3 py-1 rounded-md">
                <h1 className="text-2xl font-bold text-white drop-shadow-md">
                  John Doeeeeeeeeeeeeeee
                </h1>
                <p className="text-sm text-white/90 drop-shadow-md">@johndoe</p>
              </div>
            </div>
          </div>
          <div className="absolute right-6 bottom-4">
            <Button
              variant="outline"
              className="bg-background/80 backdrop-blur-sm"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile info for mobile */}
        <div className="sm:hidden mb-8 mt-14">
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-sm text-muted-foreground">@johndoe</p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      About
                    </h3>
                    <p className="text-sm">
                      Room reservation enthusiast and frequent traveler. Always
                      looking for the perfect meeting space.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Contact
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Icon name="Send" className="mr-2 h-4 w-4" />
                        <span>john.doe@example.com</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Icon name="Calendar" className="mr-2 h-4 w-4" />
                        <span>Joined April 2024</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Status
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                    >
                      Active Member
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Preferences
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Meeting rooms</Badge>
                      <Badge variant="secondary">Quiet spaces</Badge>
                      <Badge variant="secondary">Morning availability</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="col-span-1 md:col-span-3">
            <Tabs defaultValue="activity" className="w-full">
              <div className="border-b">
                <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="activity"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-4"
                  >
                    <Icon name="LayoutDashboard" className="h-4 w-4 mr-2" />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookings"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-4"
                  >
                    <Icon name="Calendar" className="h-4 w-4 mr-2" />
                    Bookings
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-4"
                  >
                    <Icon name="Settings2" className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="activity" className="pt-6">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Recent Activity
                    </h2>
                    <div className="space-y-4">
                      {/* Activity items */}
                      {[1, 2, 3].map((i) => (
                        <Card key={i}>
                          <CardContent className="flex items-start space-x-4 py-4">
                            <div className="rounded-full bg-primary/10 p-2">
                              <Icon
                                name="Calendar"
                                className="h-5 w-5 text-primary"
                              />
                            </div>
                            <div>
                              <div className="font-medium">
                                Room Booking Confirmed
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Conference Room A booked for{" "}
                                {i === 1 ? "today" : `${i} days ago`}
                              </p>
                            </div>
                            <div className="ml-auto text-xs text-muted-foreground">
                              {i === 1 ? "Just now" : `${i} days ago`}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Usage Statistics
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            Total Bookings
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">24</div>
                          <p className="text-xs text-muted-foreground">
                            +12% from last month
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            Favorite Room
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-medium">
                            Conference Room A
                          </div>
                          <p className="text-xs text-muted-foreground">
                            14 bookings
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="pt-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-[12px_1fr] sm:grid-cols-[12px_3fr_1fr_1fr_1fr] gap-4 p-4">
                          <div className="w-2 h-full self-stretch bg-green-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Conference Room A</div>
                            <div className="text-sm text-muted-foreground">
                              Team Meeting
                            </div>
                          </div>
                          <div className="hidden sm:block text-sm">
                            Today, 14:00-15:00
                          </div>
                          <div className="hidden sm:block text-sm">
                            8 people
                          </div>
                          <div className="hidden sm:block text-right">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-[12px_1fr] sm:grid-cols-[12px_3fr_1fr_1fr_1fr] gap-4 p-4">
                          <div className="w-2 h-full self-stretch bg-blue-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Meeting Room B</div>
                            <div className="text-sm text-muted-foreground">
                              Client Presentation
                            </div>
                          </div>
                          <div className="hidden sm:block text-sm">
                            Tomorrow, 10:00-11:30
                          </div>
                          <div className="hidden sm:block text-sm">
                            4 people
                          </div>
                          <div className="hidden sm:block text-right">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-[12px_1fr] sm:grid-cols-[12px_3fr_1fr_1fr_1fr] gap-4 p-4">
                          <div className="w-2 h-full self-stretch bg-purple-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Quiet Pod 3</div>
                            <div className="text-sm text-muted-foreground">
                              Focus Work
                            </div>
                          </div>
                          <div className="hidden sm:block text-sm">
                            May 2, 09:00-12:00
                          </div>
                          <div className="hidden sm:block text-sm">
                            1 person
                          </div>
                          <div className="hidden sm:block text-right">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-4 text-center">
                    <Button variant="outline">
                      View All Bookings
                      <Icon name="Calendar" className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and notification settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium">
                        Profile Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Update your personal information and how others see you
                        on the platform
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <h3 className="text-lg font-medium">
                        Notification Preferences
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Choose how and when you want to be notified about
                        activities
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <h3 className="text-lg font-medium">Privacy Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Control what information is shared with others
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
