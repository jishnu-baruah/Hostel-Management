import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { useApp } from '../context/AppContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Import student screens
import Dashboard from '../screens/student/Dashboard';
import Profile from '../screens/student/Profile';
import MyRoom from '../screens/student/MyRoom';
import Payments from '../screens/student/Payments';
import NoticesList from '../screens/student/NoticesList';
import Complaints from '../screens/student/Complaints';

// Import detail screens
import NoticeDetail from '../screens/student/NoticeDetail';
import PaymentDetail from '../screens/student/PaymentDetail';
import ComplaintDetail from '../screens/student/ComplaintDetail';
import CreateComplaint from '../screens/student/CreateComplaint';
import EditProfile from '../screens/student/EditProfile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack navigators for each tab
const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="DashboardMain" 
      component={Dashboard} 
      options={{ title: 'Dashboard' }}
    />
  </Stack.Navigator>
);

const RoomStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="MyRoomMain" 
      component={MyRoom} 
      options={{ title: 'My Room' }}
    />
  </Stack.Navigator>
);

const PaymentsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="PaymentsMain" 
      component={Payments} 
      options={{ title: 'Payments' }}
    />
    <Stack.Screen 
      name="PaymentDetail" 
      component={PaymentDetail} 
      options={{ title: 'Payment Details' }}
    />
  </Stack.Navigator>
);

const NoticesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="NoticesMain" 
      component={NoticesList} 
      options={{ title: 'Notices' }}
    />
    <Stack.Screen 
      name="NoticeDetail" 
      component={NoticeDetail} 
      options={{ title: 'Notice Details' }}
    />
  </Stack.Navigator>
);

const ComplaintsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="ComplaintsMain" 
      component={Complaints} 
      options={{ title: 'Complaints' }}
    />
    <Stack.Screen 
      name="ComplaintDetail" 
      component={ComplaintDetail} 
      options={{ title: 'Complaint Details' }}
    />
    <Stack.Screen 
      name="CreateComplaint" 
      component={CreateComplaint} 
      options={{ title: 'New Complaint' }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="ProfileMain" 
      component={Profile} 
      options={{ title: 'Profile' }}
    />
    <Stack.Screen 
      name="EditProfile" 
      component={EditProfile} 
      options={{ title: 'Edit Profile' }}
    />
  </Stack.Navigator>
);

const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    props.navigation.navigate('Auth');
  };
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={drawerStyles.profileBox}>
        <Image
          source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'Student') }}
          style={drawerStyles.avatar}
        />
        <Text style={drawerStyles.name}>{user?.name}</Text>
        <Text style={drawerStyles.email}>{user?.email}</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity style={drawerStyles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color={COLORS.error} style={{ marginRight: 12 }} />
        <Text style={drawerStyles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const drawerStyles = StyleSheet.create({
  profileBox: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: COLORS.gray,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.error,
  },
});

const StudentNavigator = () => {
  const { unreadNoticesCount } = useApp();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.gray,
        drawerStyle: { backgroundColor: COLORS.white, width: 240 },
        drawerLabelStyle: { fontSize: 15 },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={DashboardStack} options={{ drawerLabel: 'Home', drawerIcon: ({color, size}) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="MyRoom" component={RoomStack} options={{ drawerLabel: 'My Room', drawerIcon: ({color, size}) => <Ionicons name="bed-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Payments" component={PaymentsStack} options={{ drawerLabel: 'Payments', drawerIcon: ({color, size}) => <Ionicons name="card-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Notices" component={NoticesStack} options={{ drawerLabel: 'Notices', drawerIcon: ({color, size}) => <Ionicons name="notifications-outline" size={size} color={color} />, drawerBadge: unreadNoticesCount > 0 ? unreadNoticesCount : undefined }} />
      <Drawer.Screen name="Complaints" component={ComplaintsStack} options={{ drawerLabel: 'Complaints', drawerIcon: ({color, size}) => <Ionicons name="chatbubbles-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Profile" component={ProfileStack} options={{ drawerLabel: 'Profile', drawerIcon: ({color, size}) => <Ionicons name="person-outline" size={size} color={color} /> }} />
    </Drawer.Navigator>
  );
};

export default StudentNavigator;