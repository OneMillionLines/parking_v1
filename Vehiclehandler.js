'use strict';
const _ = require("lodash");
const SortedArray= require("sorted-array");

class vehiclehandler{
    constructor(data,db){
        this.data=data;
        this.db=db;
    }
    async load(){
        this.type=this.data.vehicle_type;
        this.name=this.data.org_ID;
        let myId=this.name+this.type;
        let result;
        let promises = [];
        let command = "select space_data from space where space_id=$1";
        let values = [myId];
        promises.push(
            this.db
            .one(command, values)
            .then(data => {
                result=data;
            })
            .catch(error => (console.log("ERROR:", error),result="On getting "+values+" we get error: "+error.detail))
        );
        await Promise.all(promises);
        //console.log(result);
        this.rawData=result.space_data;
        this.id=this.rawData.id;
        this.allocated_array=new SortedArray(this.rawData.allocated_array.array);
        this.unallocated_array=this.rawData.unallocated_array;
        //this.status();
        await this.allocate();
        console.log(this.vehicle_pos);
        return this.vehicle_pos;
    }
    isfull(){
        if(this.rawData.Acount==this.rawData.Tcount){
            return true;
        }
        return false;
    }
    status(){
        console.log("\nStatus:\n")
        console.log(this.unallocated_array);
        console.log(this.allocated_array);
    }
    allocate(){
        if(!this.isfull() && this.unallocated_array.length>=1){
            this.allocated_array.insert(this.unallocated_array[0]);
            this.vehicle_pos=this.unallocated_array.shift();
            console.log("allocated at position "+this.vehicle_pos);
            console.log("capacity remaining: "+this.unallocated_array.length);
            this.rawData.UACount-=1;
            this.rawData.Acount+=1;
        }
        else{
            this.vehicle_pos={ f_id: 0, dist: 0, pos: 0 };
        }
    }
}
module.exports=vehiclehandler;