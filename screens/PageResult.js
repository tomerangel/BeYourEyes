import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView,ImageBackground,Slider } from "react-native";
import * as Speech from 'expo-speech';
import * as firebase from 'firebase'
import Constants from "expo-constants";

import { Form, Item, Input, Label, Button, Card, CardItem } from 'native-base'
import Barcode from 'react-native-barcode-builder';
import MainService from './MainService'
import Icon from "react-native-vector-icons/FontAwesome";


export default class PageResult extends React.Component {
  
  state={
    loaded:false
    
  }
  
  constructor(props) {
    super(props)
    MainService.load(v=>this.setState({loaded:true}))
    this.state = {
      fname: "",
      phone: "",
      name: "",
      mark: null,
      allergy: null,
      isLod: false,
      Category:"",
      allergy_user: "",
      barcode: "",
      barcodeData: "",
      Calories: null,
      Sodium: null,
      Proteins: null,
      fontSize: 45,
      Carbohydrates: null,
      Fats: null,
      ifProductNotempty: "empty",
      image: "empty",
      isLoading: true,
      key: null,
      boolspeak: true,
      isUploading: false,
      isListEmpty: false
      //thingToSay:"empty"
    }

  }
  speak = ifProductNotempty => {
    let thingToSay = ifProductNotempty
    setTimeout(() => {
      Speech.speak(thingToSay, { language: "he-IW" });
  }, 2700); 
  }
  speak2() {
    let thingToSay = 'המוצר לא קיים. אתה יכול להוסיף אותו. בעמוד המוצרים '
    Speech.speak(thingToSay, { language: "he-IW" });
  }
  async componentDidMount() {
    let key = this.props.navigation.getParam("key", "");
    firebase.auth().onAuthStateChanged(authenticate => {
      if (authenticate) {
        this.setState({
          email: authenticate.email,
          allergy_user: authenticate.displayName,
        })
      } else {
        this.props.navigation.replace("SignIn")
      }
      
      let self = this;
      let barCodeData2 = this.props.navigation.state.params.barcodeData
      let ref = firebase.database().ref()  
      ref.on("value", dataSnapsot => {
        if (dataSnapsot.val()) {
        let contactResult = Object.values(dataSnapsot.val())
        //contactValue = dataSnapsot.val();
        contactResult.forEach((a) => {
          let nameA = a.barcode
          const nameB = barCodeData2
          const name = a.fname;
          const t= a.Category;
          const n = a.phone;
          const n2 = a.barcode;
          const n3 = a.key;
          const n4 = a.mark;
          const n5 = a.allergy;
          const n6 = a.Calories;
          const n7 = a.Sodium;
          const n8 = a.Carbohydrates;
          const n9 = a.Fats;
          const n10 = a.Proteins
          if(nameA==nameB){
            self.setState({
              boolspeak: false,
              fname: name,
              //  lname:contactValue.lname,
              phone: n,
              //  email:contactValue.email,
              barcode: n2,
              key: n3,
              mark: n4,
              Category:t,
              allergy: n5,
              Calories: n6,
              Sodium: n7,
              Carbohydrates: n8,
              Fats: n9,
              Proteins: n10,
              ifProductNotempty: name,
              isLoading: false,
              isListEmpty: false
            })
            this.CheckSpeicalAllregy(this.state.allergy, this.state.allergy_user)
            this.speak(this.state.ifProductNotempty)
          }
        })
        // if(this.state.ifProductNotempty=="empty"){
        //   this.ExitTohomepage();
        // }
      }

      })
      
    })
    // this.nameOfFunc();
    
  }
  getContact = async key => {
    
  };
  // nameOfFunc = async => {
  //   let ref = firebase.database().ref()
  //   let barCodeData2 = this.props.navigation.state.params.barcodeData
  //   ref.on("value", dataSnapsot => {
  //     let contactResult = Object.values(dataSnapsot.val())
  //     //fname: contactResult,
  //     contactResult.forEach((a) => {
  //       let nameA = a.barcode
  //       const nameB = barCodeData2
  //       const name = a.fname

  //       console.log(`${nameA} this is from database`)
  //       console.log(`${nameB} this is from Camera`)
  //       //console.log(`${nameA} What numers issssssss`);
  //       if (nameA == nameB) {
  //         this.state.boolspeak=false;
  //         this.setState({ len: name, isLoading: false });
  //         return name
  //       }
  //     })

  //   })
  // }
  navigateBecauseEmpty = () => {
    const { navigation } = this.props
    
    this.speak2()
    alert("המוצר לא קיים במערכת,תוכלו להוסיף אותו :)")
    setTimeout(() => {
        navigation.navigate('Hom')
    }, 800);
}
change(fontSize) {
  this.setState(() => {
    return {
      fontSize: parseFloat(fontSize)
    };
  });
}

  CheckSpeicalAllregy = (allergy, allergy_user) => {
    if ((allergy) != (allergy_user)) {
      console.log("is not same")
    }
    else {
      setTimeout(() => {
        alert("תִּזָּהֵר! הַמּוּצָר מֵכִיל אֶת הָאָלֶרְגִּיָּה אֵלֶיהָ אַתָּה רָגִישׁ")
      let thingToSay = 'תִּזָּהֵר! הַמּוּצָר מֵכִיל אֶת הָאָלֶרְגִּיָּה אֵלֶיהָ אַתָּה רָגִישׁ'
      Speech.speak(thingToSay, { language: "he-IW" });
    }, 3500); 
    }
  }
  render() {
    const { fontSize } = this.state;
    console.log(this.state.allergy_user)
    console.log(this.state.allergy)
    let d = this.props.navigation.state.params.barcodeData
    if (!this.state.loaded) {
      return (
        <View
          style={{
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
            
            
          }}
        >
          <ActivityIndicator size="large" color="#B83227" />
          <Text style={{ textAlign: "center" }}>
            אנא המתן....
          </Text>
        </View>
      );
    }
    //else if (this.state.isListEmpty) {
      if (this.state.ifProductNotempty == 'empty') {
        return (
          <View>
            {this.navigateBecauseEmpty()}
          </View>
        );
      //if(!(this.state.isListEmpty)){
      // return (
        
      //   <View style={styles.containe}>
      //     <View style={styles.cardTitle}>
      //     </View>
      //     <Card style={styles.listItem}>
      //       <Text style={styles.b}></Text>
      //       <View style={styles.cardTitle}>
      //         <Text style={styles.button}> המוצר לא קיים. אתה יכול להוסיף אותו. עם לחיצה על הוספת מוצר {this.state.ifProductNotempty} </Text>
      //       </View>
      //     </Card>
      //     <View style={styles.container4}>
      //       <TouchableOpacity style={[styles.container3]}
      //         onPress={() => {
      //           this.props.navigation.navigate("Barcode")
      //         }}
      //       >
      //         <Text style={styles.caption2}>Scan Again</Text>
      //       </TouchableOpacity>
      //     </View>
      //   </View>
      // )
      }
      else  {
    
      return (
        <ScrollView style={styles.container}>
             <ImageBackground
                source={require("../assets/images/-247289715.jpg")}
                resizeMode="stretch"
                style={styles.image}
                imageStyle={styles.image_imageStyle}
              >
          <View style={styles.contactIconContainer}>
            <TouchableOpacity
             onPress={() => {
              Speech.stop()
              let thingToSay = 'שם המוצר:'
              Speech.speak(thingToSay, { language: "he-IW" });
              let thingToSay2 = this.state.ifProductNotempty
              Speech.speak(thingToSay2, { language: "he-IW" });
            }}>
            
            <Text style={[styles.name,{fontSize:this.state.fontSize}]}>
              {this.state.fname}
            </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <Card style={{marginTop:25}}>
              <CardItem bordered>
                
              <Text style={styles.infoText}> קלוריות |</Text> 
               <Text style={styles.infoText}> שומנים |</Text> 
                <Text style={styles.infoText}> פחמימות |</Text> 
                 <Text style={styles.infoText}> חלבונים |</Text> 
              <Text style={styles.infoText}>| נתרן |</Text> 
              </CardItem>
              <CardItem bordered>
                <Text style={styles.infoText2}>|    {this.state.Calories}    |</Text>
                <Text style={styles.infoText2}>     {this.state.Fats}   |</Text>
                <Text style={styles.infoText2}>     {this.state.Carbohydrates}    |</Text>
                <Text style={styles.infoText2}>     {this.state.Proteins}   |</Text>
                <Text style={styles.infoText2}>     {this.state.Sodium}  |</Text>
              </CardItem>

            </Card>
            <Card style={{marginTop:5}}>
            <TouchableOpacity
              onPress={() => {
                Speech.stop()
                let thingToSay = 'הקטגוריה של המוצר:'
                Speech.speak(thingToSay, { language: "he-IW" });
                let thingToSay2 = this.state.Category
                Speech.speak(thingToSay2, { language: "he-IW" });
              }}
            >
             
              <CardItem bordered>
             
                <Text style={styles.infoText6}>קטגוריה</Text>
             
              </CardItem>
           
              </TouchableOpacity>
              <CardItem bordered>
                <Text style={styles.infoText5}>{this.state.Category}</Text>
              </CardItem>
              </Card>
              <Card style={{marginTop:5}}>
            <TouchableOpacity
              onPress={() => {
                Speech.stop()
                let thingToSay = 'האלרגיה שהמוצר מכיל היא:'
                Speech.speak(thingToSay, { language: "he-IW" });
                let thingToSay2 = this.state.allergy
                Speech.speak(thingToSay2, { language: "he-IW" });
              }}
            >
              <CardItem bordered>
                <Text style={styles.infoText7}>אלרגיה מסוימת</Text>
              </CardItem>
              </TouchableOpacity>
            
              <CardItem bordered>
                <Text style={styles.infoText8}>{this.state.allergy}</Text>
              </CardItem>
            
            </Card>
            <Card style={{marginTop:5}}>
            <TouchableOpacity
              onPress={() => {
                Speech.stop()
                let thingToSay = 'סימון משרד הבריאות:'
                Speech.speak(thingToSay, { language: "he-IW" });
                let thingToSay2 = this.state.mark
                Speech.speak(thingToSay2, { language: "he-IW" });
              }}
            >
              <CardItem bordered>
                <Text style={styles.infoText9}>סימון משרד הבריאות</Text>
              </CardItem>
              </TouchableOpacity>
              <CardItem bordered style={(this.state.mark == "תקין-ירוק") ? styles.infoText3 : styles.infoText4}>
                <Text style={styles.infoText10}>{this.state.mark}</Text>
              </CardItem>
            </Card>
            <Card style={{marginTop:5}}>
              <CardItem bordered>
                <Text style={styles.infoText11}>ברקוד</Text>
              </CardItem>
              <CardItem bordered>
                <Barcode  value={this.state.barcode} format="CODE128" />
              </CardItem>
            </Card>
            {/* <Icon name="reply" style={styles.icon2}
            onPress={() => {
             this.props.navigation.navigate("Hom");

            }}
            ></Icon> */}
              <View style={styles.wrapperHorizontal}>
                <Slider
                  thumbTintColor="#DAA520"
                  minimumTrackTintColor="#DAA520"
                  minimumValue={10}
                  maximumValue={100}
                  step={1}
                  onValueChange={this.change.bind(this)}
                  value={fontSize}
                />
              </View>
            {/* <CustomSlider
            label="Font Size"
            value={15}
            maximumValue={40}
            handleValueChange={this.state.setFontSize}
          /> */}
          </View>
          
          </ImageBackground>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
    backgroundColor: "#fff"
  },
  contactIconContainer: {

    textAlign: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  icon2: {
    color: "black",
    fontSize: 58,
    height: 58,
    width: 58,
    marginTop: 18,
    marginLeft: 180,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  contactIcon: {
    // to create a square box both height and width should be same
    height: 130,//Dimensions.get("window").width,
    width: 20//Dimensions.get("window").width
  },
  nameContainer: {
    textAlign: 'right',
    width: "100%",
    height: 70,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    position: "absolute",
    bottom: 0
  },
  name: {
    fontSize: 50,
    color: "#000",
    fontWeight: "900"
  },
  infoText2: {
    left:155,
    textAlign: 'right',
    fontSize: 18,
    
  },
  infoText10: {
    left:290,
    textAlign: 'right',
    fontSize: 18,
    
  },
  infoText8: {
    left:355,
    textAlign: 'right',
    fontSize: 18,
    
  },
  infoText: {
    left:0,
    textAlign: 'right',
    fontSize: 24,
    fontWeight: "bold"
  },
  infoText11: {
    left:330,
    textAlign: 'right',
    fontSize: 20,
    fontWeight: "bold"
  },
  infoText9: {
    left:220,
    textAlign: 'right',
    fontSize: 24,
    fontWeight: "bold"
  },
  infoText6: {
    left:320,
    textAlign: 'right',
    fontSize: 25,
    fontWeight: "bold"
  },
  infoText7: {
    left:260,
    textAlign: 'right',
    fontSize: 25,
    fontWeight: "bold"
  },
  infoText3: {
    backgroundColor: "green",
  },
  infoText4: {
    backgroundColor: "red",
  },
  infoText5: {
    left:330,
    textAlign: 'right',
    fontSize: 18,
    
  },
  actionContainer: {
    textAlign: "center",
    flexDirection: "row"
  },
  actionButton: {
    textAlign: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  actionText: {
    textAlign: "center",
    color: "#0033cc",
    fontWeight: "900"
  },
  inputItem: {
    margin: 10
  },
  button: {
    //marginRight: 30,
    //textAlign: 'left',
    //marginTop:30,
    //right:30,
    //backgroundColor: "#B83227",
    color: "black",
    fontWeight: 'bold',
    fontSize: 20
  },
  button2: {
    //marginRight: 30,
    //textAlign: 'left',
    //marginTop:30,
    //right:30,
    //backgroundColor: "#B83227",
    color: "red",
    fontWeight: 'bold',
    fontSize: 30
  },
  image: {
    top: 0,
    left: 0,
    width: 420,
    height: 670,
    position: "absolute"
  },
  button3: {
    //marginRight: 30,
    //textAlign: 'left',
    //marginTop:30,
    //right:30,
    //backgroundColor: "#B83227",
    color: "blue",
    fontWeight: 'bold',
    fontSize: 30
  },
  b: {
    marginTop: 30,
    fontSize: 20,
    textAlign: 'left',

  },
  title: {
    color: "#4d4db8",
    fontWeight: 'bold',
    fontSize: 50
  },
  cardTitle: {
    textAlign: 'left',
  },
  listItem: {
    //flexDirection: "row",
    //padding: 50,
    // color: "#335cd6",
    //borderWidth: 100,
    justifyContent: "flex-start",
    borderColor: "#335cd6"
  },
  listItem2: {
    //flexDirection: "row",
    //padding: 50,
    // color: "#335cd6",
    //borderWidth: 100,
    justifyContent: "flex-start",
    borderColor: "red"
  },
  contactIcon: {
    width: 60,
    height: 60,
    borderRadius: 100
  },
  infoContainer: {
    flexDirection: "column"
  },
  
  con: {
    width: 420,
    height: 250
  },
  container4: {
    //top: 130,
    //left: 0,
    width: 420,
    height: 124,
    position: "absolute",
    marginTop: 272
  },
  button4: {
    backgroundColor: "green"

  },
  button5: {
    fontWeight: 'bold',
    fontSize: 25
  },
  button6: {
    backgroundColor: 'red'
  },
  container2: {
    backgroundColor: "#6685e0",
    flexDirection: "row",
    alignItems: "center",
    width: 430,
    height: 200,
    justifyContent: "center",
    //paddingRight: 16,
    //paddingLeft: 19,
    //marginTop: 200,
    elevation: 9,
    //minWidth: 180,
    borderRadius: 2,

  },
  container3: {
    backgroundColor: "#335cd6",
    flexDirection: "row",
    alignItems: "center",
    width: 430,
    height: 200,
    //justifyContent: "center",
    //marginEnd: 20,
    //marginTop: 80,
    //paddingRight: 16,
    //paddingLeft: 19,
    elevation: 9,
    //minWidth: 180,
    borderRadius: 2,

  },
  
  caption: {
    color: "#fff",
    fontSize: 50,
    //fontFamily: "roboto-regular"
  },
  caption2: {
    color: "#fff",
    fontSize: 50,
    //fontFamily: "roboto-regular"
  },

  group: {
    width: 420,
    height: 220,
    justifyContent: "center",
    marginTop: 492,
    alignSelf: "center"
  },
  materialButtonViolet: {
    width: 360,
    height: 360
  }
})  