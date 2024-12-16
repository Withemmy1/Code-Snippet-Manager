import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserProfile from './UserProfile'
import SecuritySettings from './SecuritySettings'
// import NotificationSettings from './NotificationSettings'; // Comment this out if the file is missing

const UserSettings: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UserSettings 