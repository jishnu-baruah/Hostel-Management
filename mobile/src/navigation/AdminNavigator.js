import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Import admin screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import ManageStudents from '../screens/admin/ManageStudents';
import ManageRooms from '../screens/admin/ManageRooms';
import ManagePayments from '../screens/admin/ManagePayments';
import CreateNotice from '../screens/admin/CreateNotice';
import ManageComplaints from '../screens/admin/ManageComplaints';
import ManageNotices from '../screens/admin/ManageNotices';

// Import detail screens
import StudentDetail from '../screens/admin/StudentDetail';
import RoomDetail from '../screens/admin/RoomDetail';
import PaymentDetail from '../screens/admin/PaymentDetail';
import ComplaintDetail from '../screens/admin/ComplaintDetail';
import EditRoom from '../screens/admin/EditRoom';
import CreateRoom from '../screens/admin/CreateRoom';
import EditNotice from '../screens/admin/EditNotice';
import AdminProfile from '../screens/admin/AdminProfile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack navigators for each tab
const DashboardStack = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft: () => (
        <Ionicons
          name="menu"
          size={28}
          color={COLORS.white}
          style={{ marginLeft: 16 }}
          onPress={() => navigation.openDrawer()}
        />
      ),
    }}
  >
    <Stack.Screen 
      name="AdminDashboardMain" 
      component={AdminDashboard} 
      options={{ title: 'Admin Dashboard' }}
    />
  </Stack.Navigator>
);

const StudentsStack = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft: () => (
        <Ionicons
          name="menu"
          size={28}
          color={COLORS.white}
          style={{ marginLeft: 16 }}
          onPress={() => navigation.openDrawer()}
        />
      ),
    }}
  >
    <Stack.Screen 
      name="ManageStudentsMain" 
      component={ManageStudents} 
      options={{ title: 'Manage Students' }}
    />
    <Stack.Screen 
      name="StudentDetail" 
      component={StudentDetail} 
      options={{ title: 'Student Details' }}
    />
  </Stack.Navigator>
);

const RoomsStack = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft: () => (
        <Ionicons
          name="menu"
          size={28}
          color={COLORS.white}
          style={{ marginLeft: 16 }}
          onPress={() => navigation.openDrawer()}
        />
      ),
    }}
  >
    <Stack.Screen 
      name="ManageRoomsMain" 
      component={ManageRooms} 
      options={{ title: 'Manage Rooms' }}
    />
    <Stack.Screen 
      name="RoomDetail" 
      component={RoomDetail} 
      options={{ title: 'Room Details' }}
    />
    <Stack.Screen 
      name="EditRoom" 
      component={EditRoom} 
      options={{ title: 'Edit Room' }}
    />
    <Stack.Screen 
      name="CreateRoom" 
      component={CreateRoom} 
      options={{ title: 'Create Room' }}
    />
  </Stack.Navigator>
);

const PaymentsStack = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft: () => (
        <Ionicons
          name="menu"
          size={28}
          color={COLORS.white}
          style={{ marginLeft: 16 }}
          onPress={() => navigation.openDrawer()}
        />
      ),
    }}
  >
    <Stack.Screen 
      name="ManagePaymentsMain" 
      component={ManagePayments} 
      options={{ title: 'Manage Payments' }}
    />
    <Stack.Screen 
      name="PaymentDetail" 
      component={PaymentDetail} 
      options={{ title: 'Payment Details' }}
    />
  </Stack.Navigator>
);

const NoticesStack = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft: () => (
        <Ionicons
          name="menu"
          size={28}
          color={COLORS.white}
          style={{ marginLeft: 16 }}
          onPress={() => navigation.openDrawer()}
        />
      ),
    }}
  >
    <Stack.Screen 
      name="ManageNotices" 
      component={ManageNotices} 
      options={{ title: 'Manage Notices' }}
    />
    <Stack.Screen 
      name="CreateNotice" 
      component={CreateNotice} 
      options={{ title: 'Create Notice' }}
    />
    <Stack.Screen 
      name="EditNotice" 
      component={EditNotice} 
      options={{ title: 'Edit Notice' }}
    />
  </Stack.Navigator>
);

const ComplaintsStack = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft: () => (
        <Ionicons
          name="menu"
          size={28}
          color={COLORS.white}
          style={{ marginLeft: 16 }}
          onPress={() => navigation.openDrawer()}
        />
      ),
    }}
  >
    <Stack.Screen 
      name="ManageComplaintsMain" 
      component={ManageComplaints} 
      options={{ title: 'Manage Complaints' }}
    />
    <Stack.Screen 
      name="ComplaintDetail" 
      component={ComplaintDetail} 
      options={{ title: 'Complaint Details' }}
    />
  </Stack.Navigator>
);

const ProfileStack = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft: () => (
        <Ionicons
          name="menu"
          size={28}
          color={COLORS.white}
          style={{ marginLeft: 16 }}
          onPress={() => navigation.openDrawer()}
        />
      ),
    }}
  >
    <Stack.Screen 
      name="AdminProfileMain" 
      component={AdminProfile} 
      options={{ title: 'Profile' }}
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
          source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'Admin') }}
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

const AdminNavigator = () => {
  const { logout } = useAuth();
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.gray,
        drawerStyle: { backgroundColor: COLORS.white, width: 240 },
        drawerLabelStyle: { fontSize: 15 },
      }}
    >
      <Drawer.Screen name="Dashboard" children={({ navigation }) => <DashboardStack navigation={navigation} />} options={{ drawerLabel: 'Dashboard', drawerIcon: ({color, size}) => <Ionicons name="stats-chart-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Profile" children={({ navigation }) => <ProfileStack navigation={navigation} />} options={{ drawerLabel: 'Profile', drawerIcon: ({color, size}) => <Ionicons name="person-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Students" children={({ navigation }) => <StudentsStack navigation={navigation} />} options={{ drawerLabel: 'Students', drawerIcon: ({color, size}) => <Ionicons name="people-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Rooms" children={({ navigation }) => <RoomsStack navigation={navigation} />} options={{ drawerLabel: 'Rooms', drawerIcon: ({color, size}) => <Ionicons name="business-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Payments" children={({ navigation }) => <PaymentsStack navigation={navigation} />} options={{ drawerLabel: 'Payments', drawerIcon: ({color, size}) => <Ionicons name="card-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Notices" children={({ navigation }) => <NoticesStack navigation={navigation} />} options={{ drawerLabel: 'Notices', drawerIcon: ({color, size}) => <Ionicons name="megaphone-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Complaints" children={({ navigation }) => <ComplaintsStack navigation={navigation} />} options={{ drawerLabel: 'Complaints', drawerIcon: ({color, size}) => <Ionicons name="chatbubbles-outline" size={size} color={color} /> }} />
    </Drawer.Navigator>
  );
};

export default AdminNavigator;