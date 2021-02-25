import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput,Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

import * as firebase from "firebase"
import db from "../config"

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedData: '',
      buttonState: 'normal',
      scannedStudentId: "",
      scannedBookId:"",
      transactionMessage:""
    }
  }

  getCameraPermissions = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" is true when user has granted permission
        status === "granted" is false when user has not granted the permission
      */
      hasCameraPermissions: status === "granted",
      buttonState: id,
      scanned: false
    });
  }
  initiateBookIssue = async()=>{
    //add a transaction
    // db.collection("transactions").add({
    //   'studentId': this.state.scannedStudentId,
    //   'bookId' : this.state.scannedBookId,
    //   'date' : firebase.firestore.Timestamp.now().toDate(),
    //   'transactionType': "Issue"
    // })
    // //change book status
    // db.collection("books").doc(this.state.scannedBookId).update({
    //   'bookAvailability': false
    // })
    // //change number  of issued books for student
    // db.collection("students").doc(this.state.scannedStudentId).update({
    //   'numberOfBooksIssued': firebase.firestore.FieldValue.increment(1)
    // })
    // this.setState(
    //   {scannedBookId:'',
    //    scannedStudentId:''})
    console.log("issue")
  }

  initiateBookReturn = async()=>{
    //add a transaction
    // db.collection("transactions").add({
    //   'studentId': this.state.scannedStudentId,
    //   'bookId' : this.state.scannedBookId,
    //   'date' : firebase.firestore.Timestamp.now().toDate(),
    //   'transactionType': "Return"
    // })
    // //change book status
    // db.collection("books").doc(this.state.scannedBookId).update({
    //   'bookAvailability': true
    // })
    // //change number  of issued books for student
    // db.collection("students").doc(this.state.scannedStudentId).update({
    //   'numberOfBooksIssued': firebase.firestore.FieldValue.increment(-1)
    // })
    // this.setState(
    //   {scannedBookId:'',
    //    scannedStudentId:''})
    console.log("return")
  }


  handleTransaction = async()=>{
    var transactionMessage
    db.collection("books").doc(this.state.scannedBookId).get()
    .then((doc)=>{
      console.log(doc.data())
        //snapshot.forEach((doc)=>{
          var book = doc.data()
          if(book.bookAvailability){
              this.initiateBookIssue();       
              transactionMessage = "Book Issued"
              ToastAndroid.show(transactionMessage, ToastAndroid.SHORT);
              // Alert.alert(transactionMessage)
          }
          else{
              this.initiateBookReturn();
              transactionMessage = "Book Returned"
              ToastAndroid.show(transactionMessage, ToastAndroid.SHORT);
              // Alert.alert(transactionMessage)
          }
    })

    this.setState({
      transactionMessage: transactionMessage
    })
  }

  handleBarCodeScanned = async ({ type, data }) => {
    if (this.state.buttonState === "studentId") {
      this.setState({
        scanned: true,
        scannedStudentId: data,
        buttonState: 'normal'
      });
    }
     else if(this.state.buttonState==="bookId"){
      this.setState({
        scanned: true,
        scannedBookId: data,
        buttonState: 'normal'
      });
     }
  }

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (buttonState != "normal" && hasCameraPermissions) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }

    else if (buttonState === "normal") {
      return (
        <View style={styles.container}>

          <Image  source={require("../assets/booklogo.jpg")} style={{width:200,height:200}}/>
          <Text style={{textAlign: 'center', fontSize: 30,margin:10}}>Wily</Text>




          <View style={styles.inputView}>
            <TextInput placeholder="Student Id" style={styles.inputbox} 
            onChangeText={text=>this.setState({scannedStudentId:text})}
            value={this.state.scannedStudentId}
             />
            <TouchableOpacity
              onPress={() => { this.getCameraPermissions("studentId") }}
              style={styles.scanButton}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.inputView}>
            <TextInput placeholder="Book Id" style={[styles.inputbox, {marginTop:10}]} 
            value={this.state.scannedBookId} 
            onChangeText={(text)=>{this.setState({scannedBookId:text})}}/>
            <TouchableOpacity
              onPress={() => { this.getCameraPermissions("bookId") }}
              style={[styles.scanButton, {marginTop:10}]}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>

           

          </View>
          <TouchableOpacity
            style={styles.submitButton}
              onPress={async()=>{ var transactionMessage=this.handleTransaction}}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  inputView: {
    flexDirection: "row"
  },
  inputbox: {
    width: 200,
    height: 40,
    borderWidth: 2,
    borderRightWidth: 0,
    fontSize: 15,
    padding: 5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  displayText: {
    fontSize: 15,
    textDecorationLine: 'underline'
  },
  scanButton: {
    backgroundColor: '#2196F3',
    width: 80
  },
  submitButton: {
    backgroundColor: '#33377A',
    width: 80,
    textAlign: "center",
    paddingBottom:7,
    margin: 15
  },
  buttonText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    color:"white"

  }
});