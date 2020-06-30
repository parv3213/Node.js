// const square = function (x){
//     return x * x;
// }

// const square = (x) => {
//     return x * x ;
// }


// const square = (x) => x * x ;

// console.log(square(5));

const event = {
    name: 'Birthday Party',
    guestList: ["parv", "nizam","sanajna"],
    printGuestList() {
        console.log('guest list for ' + this.name);
        this.guestList.forEach((guest) => {
            console.log(guest+" is attending "+this.name);
        });
    }
}

event.printGuestList();