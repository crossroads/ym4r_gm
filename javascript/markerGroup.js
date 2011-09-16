function MarkerGroup(active, markers, markersById) {
  this.active = active;
  this.markers = markers || new Array();
  this.markersById = markersById || new Object();
}

MarkerGroup.prototype = new GOverlay();

MarkerGroup.prototype.initialize = function(map) {
  this.map = map;

  if(this.active){
    for(var i = 0 , len = this.markers.length; i < len; i++) {
      this.markers[i].setMap(this.map);
    }
    for(var id in this.markersById){
      this.markersById[id].setMap(this.map);
    }
  }
}

//If not already done (ie if not inactive) remove all the markers from the map
MarkerGroup.prototype.remove = function() {
  this.deactivate();
}

MarkerGroup.prototype.redraw = function(force){
  //Nothing to do : markers are already taken care of
}

//Copy the data to a new Marker Group
MarkerGroup.prototype.copy = function() {
  var overlay = new MarkerGroup(this.active);
  overlay.markers = this.markers; //Need to do deep copy
  overlay.markersById = this.markersById; //Need to do deep copy
  return overlay;
}

//Inactivate the Marker group and clear the internal content
MarkerGroup.prototype.clear = function(){
  //deactivate the map first (which removes the markers from the map)
  this.deactivate();
  //Clear the internal content
  this.markers = new Array();
  this.markersById = new Object();
}

//Add a marker to the GMarkerGroup ; Adds it now to the map if the GMarkerGroup is active
MarkerGroup.prototype.addMarker = function(marker,id){
  if(id == undefined){
    this.markers.push(marker);
  }else{
    this.markersById[id] = marker;
  }
  if(this.active && this.map != undefined ){
    marker.setMap(this.map);
  }
}

//Open the info window (or info window tabs) of a marker
MarkerGroup.prototype.showMarker = function(id){
  var marker = this.markersById[id];
  if(marker != undefined){
    google.maps.event.trigger(marker,"click");
  }
}

//Activate (or deactivate depending on the argument) the GMarkerGroup
MarkerGroup.prototype.activate = function(active){
  active = (active == undefined) ? true : active;
  if(!active){
    if(this.active){
      if(this.map != undefined){
        for(var i = 0 , len = this.markers.length; i < len; i++){
            this.map.removeOverlay(this.markers[i])
        }
        for(var id in this.markersById){
            this.map.removeOverlay(this.markersById[id]);
        }
      }
      this.active = false;
    }
  } else {
    if(!this.active){
      if(this.map != undefined){
        for(var i = 0 , len = this.markers.length; i < len; i++){
          this.markers[i].setMap(this.map);
        }
        for(var id in this.markersById){
          this.markersById[id].setMap(this.map);
        }
      }
      this.active = true;
    }
  }
}

MarkerGroup.prototype.centerAndZoomOnMarkers = function() {
  if(this.map != undefined){
    //merge markers and markersById
    var tmpMarkers = this.markers.slice();
    for (var id in this.markersById){
      tmpMarkers.push(this.markersById[id]);
    }
    if(tmpMarkers.length > 0){
      this.map.centerAndZoomOnMarkers(tmpMarkers);
    }
  }
}

//Deactivate the Group Overlay (convenience method)
MarkerGroup.prototype.deactivate = function(){
  this.activate(false);
}
