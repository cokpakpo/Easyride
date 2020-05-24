
module.exports = (riderLat, riderLng, driverLat, driverLng ) => {
    if(( riderLat == driverLat) && (riderLng == driverLng)){
        return 0
    }
    else {
       const radDriverLat = Math.PI * driverLat / 180
       const radRiderLat = Math.PI * riderLat / 180
       const theta = riderLng - driverLng
       const radTheta = Math.PI * theta / 180
       var distance = Math.sin(radRiderLat) * Math.sin(radDriverLat) + Math.cos(radRiderLat) * Math.cos(radDriverLat) * Math.cos(radTheta)
       if(distance > 1){
           distance = 1
       }
       distance = Math.acos(distance)
       distance = distance * 180 / Math.PI
       distance = distance * 60 * 1.1515
       distance = distance * 1.609344

       return distance
    }
}


    
    
   