'use strict';

// const Car=require('./car')
// const Bike=require('./bike')
// const Van=require('./van')

const _  =require('lodash');
const range = require("range");
const arraySort = require('array-sort');
const SortedArray= require("sorted-array");

class Vehicle{
    constructor(value,db){
        //full json input from payload from user
        this.data=value;
        this.db=db;
        this.distributor();
    }
    getData(){
        console.log(this.data);
    }
    // distributor(){
    //     //splitting input into each vehicle
    //     let carData = this.getVehicleData("car");
    //     let bikeData= this.getVehicleData("bike");
    //     let vanData = this.getVehicleData("van");

    //     console.log("\nCAR DATA");
    //     console.log(carData);
    //     console.log("==========================");

    //     console.log("\nBIKE DATA");
    //     console.log(bikeData);
    //     console.log("==========================");

    //     console.log("\nVAN DATA");
    //     console.log(vanData);
    //     console.log("==========================");

    //     // let car = new Car(carData,db);
    //     // let bike = new Bike(bikeData,db);
    //     // let van = new Van(vanData,db);
    //     this.pushInDB("car",carData);
    //     this.pushInDB("bike",bikeData);
    //     this.pushInDB("van",vanData);
    // }
    distributor(){
        //splitting input into each vehicle
        let carData = this.getVehicleData1("car");
        let bikeData= this.getVehicleData1("bike");
        let vanData = this.getVehicleData1("van");

        carData["unallocated_array"]=this.createArray(carData);
        bikeData["unallocated_array"]=this.createArray(bikeData);
        vanData["unallocated_array"]=this.createArray(vanData);

        console.log("\nCAR DATA");
        console.log(carData);
        console.log("==========================");

        console.log("\nBIKE DATA");
        console.log(bikeData);
        console.log("==========================");

        console.log("\nVAN DATA");
        console.log(vanData);
        console.log("==========================");

        // let car = new Car(carData,db);
        // let bike = new Bike(bikeData,db);
        // let van = new Van(vanData,db);
        this.pushInDB("car",carData);
        this.pushInDB("bike",bikeData);
        this.pushInDB("van",vanData);
    }

    getVehicleData(value){
        let val=value;
        let Data=this.data;
        let id=Data.id;
        let distribution=[];
        let mycount=0;
        _.each(Data.floor_id,f_id=>{
            let key_val=Data.descr[f_id][val];
            mycount+=key_val.count;
            distribution.push({[f_id]:key_val});
        });
        let priceVal=Data.price[val];
        let propo=Data.propo[val];
        
        return {"id":id,"descr":distribution,"price":priceVal,"propo":propo,"Tcount":mycount,"floor_id":Data.floor_id,"floors":Data.floors,"Acount":0,"UACount":mycount};
    }

    getVehicleData1(value){
        let val=value;
        let Data=this.data;
        let id=Data.id;
        let distribution={};
        let mycount=0;
        _.each(Data.floor_id,f_id=>{
            let key_val=Data.descr[f_id][val];
            mycount+=key_val.count;
            distribution[f_id]=key_val;
        });
        let priceVal=Data.price[val];
        let propo=Data.propo[val];
        
        let allocated_array=new SortedArray([]);

        return {"id":id,"descr":distribution,"price":priceVal,"propo":propo,"Tcount":mycount,"floor_id":Data.floor_id,"floors":Data.floors,"Acount":0,"UACount":mycount,"allocated_array":allocated_array};
    }

    createArray(vehic_dat){
        let dat=vehic_dat;
        let unsorted_unallocated_array=[];
        let floor_id=dat.floor_id;
        let descr=dat.descr;
        _.each(floor_id,f_id=>{
            _.each(descr[f_id].d_id,d_number=>{
                _.each(range.range(1,descr[f_id].dist[d_number]+1),pos=>{
                    unsorted_unallocated_array.push({"f_id":f_id,"dist":d_number,"pos":pos});
                })
            });
        });
        //console.log(finalArray);
        const unallocated_array=arraySort(unsorted_unallocated_array,['f_id','dist','pos']);
        console.log(unallocated_array);
        return unallocated_array;
    }

    async pushInDB(value,data){
        let db=this.db;
        let result = [];
        let promises = [];
        let command = "INSERT INTO space(space_id, space_data) VALUES ($1,$2)";
        let myId=data.id+value;
        let values = [myId, data];
        promises.push(
            db
            .any(command, values)
            .then(data => {
                result.push(myId+" is inserted");
            })
            .catch(error => (console.log("ERROR:", error),result.push("On inserting "+values+" we get error: "+error.detail)))
        );
        await Promise.all(promises);
        console.log(result);
    }
}
// To check vehicle work independently
// let inp_Data= {
//     "id": "EA",
//     "name": "EA",
//     "floors": 3,
//     "floor_id": [1,2,3],
//     "propo":{"car":3,"bike":1,"van":6},
//     "descr":
//         {
//             "1": {
//                 "car": {
//                     "count": 20,
//                     "d_id": [
//                         1,2,3,4
//                     ],
//                     "dist": {
//                         "1": 10,
//                         "2": 5,
//                         "3": 3,
//                         "4": 2
//                     }
//                 },
//                 "bike": {
//                     "count": 50,
//                     "d_id": [
//                         1,2,3,4
//                     ],
//                     "dist": {
//                         "1": 10,
//                         "2": 5,
//                         "3": 15,
//                         "4": 20
//                     }
//                 },
//                 "van": {
//                     "count": 5,
//                     "d_id": [
//                         1,2
//                     ],
//                     "dist": {
//                         "1": 2,
//                         "2": 3
//                     }
//                 }
//             }
//         ,
        
//             "2": {
//                 "car": {
//                     "count": 20,
//                     "d_id": [
//                         1,2,3,4
//                     ],
//                     "dist": {
//                         "1": 10,
//                         "2": 5,
//                         "3": 3,
//                         "4": 2
//                     }
//                 },
//                 "bike": {
//                     "count": 50,
//                     "d_id": [
//                         "1",
//                         "2",
//                         "3",
//                         "4"
//                     ],
//                     "dist": {
//                         "1": 10,
//                         "2": 5,
//                         "3": 15,
//                         "4": 20
//                     }
//                 },
//                 "van": {
//                     "count": 5,
//                     "d_id": [
//                         1,
//                         2
//                     ],
//                     "dist": {
//                         "1": 2,
//                         "2": 3
//                     }
//                 }
//             }
//         ,
        
//             "3": {
//                 "car": {
//                     "count": 20,
//                     "d_id": [
//                         1,2,3,4
//                     ],
//                     "dist": {
//                         "1": 10,
//                         "2": 5,
//                         "3": 3,
//                         "4": 2
//                     }
//                 },
//                 "bike": {
//                     "count": 50,
//                     "d_id": [
//                         1,2,3,4
//                     ],
//                     "dist": {
//                         "1": 10,
//                         "2": 5,
//                         "3": 15,
//                         "4": 20
//                     }
//                 },
//                 "van": {
//                     "count": 5,
//                     "d_id": [
//                         1,2
//                     ],
//                     "dist": {
//                         "1": 2,
//                         "2": 3
//                     }
//                 }
//             }
//         }
//     ,
//     "price": {
//         "car": {
//             "h0": 30,
//             "step": 20
//         },
//         "bike": {
//             "h0": 30,
//             "step": 20
//         },
//         "van": {
//             "h0": 30,
//             "step": 20
//         }
//     }
// }
// let vehicle = new Vehicle(inp_Data);

module.exports=Vehicle;