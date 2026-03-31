import { View , Text } from "react-native";

const NewComponent = (props:any) => {
     const email = props.email ;

    const name = props.name ;
  return (
   
    <View> 
        <Text>New Component</Text>   
        <Text>{email}</Text>
        <Text>{name}</Text>
    </View>
  );
}
export default NewComponent;