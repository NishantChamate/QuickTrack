// script.js

let map; // Declare map variable

// Initialize Socket.IO
const socket = io();

// Check for geolocation support
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });

            // Ensure map is initialized before accessing
            if (map) {
                map.setView([latitude, longitude], 16);
                // Update marker position or initialize it as needed
            }
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}

// Initialize Leaflet map once the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    map = L.map("map").setView([0, 0], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "SPIT Mumbai"
    }).addTo(map);

    // Additional map initialization or event bindings can go here
});

const markers={};
socket.on("receive-location",(data)=>{
    const { id,latitude,longitude}=data;
    map.setView([latitude,longitude],16);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});