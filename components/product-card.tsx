 import { View, Text, Image } from "react-native";

import { Link } from "expo-router"; 
const ProductCard = ({id , name , description , imageURL ,  price } : any) => {
    return (
        <View>
<View key={id}>
        <Text>name: {name}</Text>
         <Text>{description}</Text>
          <Text>price: {price}</Text>
         <Link href={`/productdetails/${id}`}>
          <Image source={{uri: imageURL}} style={{width: 100, height: 100}} />   
           <Text>id: {id}</Text>
            </Link>
      </View>
        </View>
    )
}
export default ProductCard;