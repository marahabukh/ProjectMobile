import NewComponent from '@/components/new-component';
import { useState } from 'react';
import { Pressable, StyleSheet, View  , } from 'react-native';
import { Image, Switch, Text, TextInput } from 'react-native';
import { FlatList } from 'react-native';
export default function HomeScreen() {
  const[value, setValue] = useState('');
  const onchange = (value: string) => {
    setValue(value);}
      const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const[name,setName] = useState('');
  const[email,setEmail] = useState('');
  const handleNameChange = (name: string) => {
    setName(name);
  }
  const handleEmailChange = (email: string) => {
    setEmail(email);
  }
  return (
 <view>
<Text style={styles.Text}>Home Screen</Text>
<Image source={require('@/assets/images/partial-react-logo.png')} style={{ width: 290, height: 178 }} />
<TextInput 
  placeholder="Enter text here"
  value={value}
  onChangeText={onchange}
/>
<TextInput 
  placeholder="Enter name here"
  value={name}
  onChangeText={handleNameChange}
/>
<TextInput 
  placeholder="Enter email here"
  value={email}
  onChangeText={handleEmailChange}
/>
<Text style={styles.Text}>
  You entered: {value}
</Text>

 <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />

        <FlatList
          data={[{key: 'a'}, {key: 'b'}, {key: 'c'}]}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />  
<NewComponent email={email} password={value}   />
 </view>

  );
} 
  const styles = StyleSheet.create ({
    Text: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
  }); 
