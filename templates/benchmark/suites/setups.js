const uid = require('uuidv4');

/** title of test */
const TEST_TITLE = 'async generator vs promise';

const names = ["Video_games_Nuclear","Horse_YouTube","Monster_Breakfast","Prints_Elevator","Book_Post_office","YouTube_Toolbox","Cone_Prints","Leash_YouTube","Boat_Ice_cream","Male_Fusion","Urine_Dislike","Hnads_Boat","Mail_Puppy","Book_Flowers","Shoes_Plants","System_Breakfast","Light_saber_Horse","Ring_Comics","Male_Comics","Soap_Post_office","Nuclear_Solar","Leash_BBQ","System_Towel","Clock_Towel","Ice_cream_Male","Leash_System","Puppy_Dislike","Solar_Laptop","Horse_Dog","Website_Trees","Floppy_Disk_Clock","Plus_Solar","Robot_Sink","Running_Android","Clock_Shoe","Flowers_Fusion","Horse_Allergies","Towel_Clock","Fusion_Soda","Sink_Trees","Toolbox_Sink","Shower_Light_saber","Flowers_Monster","Clock_Monster","Plus_Water","Urine_System","Nuclear_Allergies","Soda_Whale","Horse_Book","Ring_Website","Boat_Boat","Plants_Laptop","Running_Shelf","Trees_Trees","Mail_Floppy_Disk","Dog_Puppy","Elevator_Plants","Clock_Sink","Solar_Dislike","Nuclear_Settings","Water_Trees","Horse_Breakfast","Soda_Kitty","Puppy_Toolbox","Flowers_Nuclear","Laptop_Solar","Flowers_Dislike","Drugs_Flowers","Rollers_Kitty","Cat_Elevator","Soap_Solar","Light_saber_YouTube","Robot_Boat","Male_Boat","BBQ_System","Mail_Male","Shoes_Urine","Rollers_Settings","Robot_Running","Fusion_Comics","Website_Nuclear","Cat_Kitty","Elevator_Floppy_Disk","Elevator_Printer","Kitty_Toolbox","Shower_BBQ","Settings_Android","Ice_cream_Shower","Websites_Elevator","Body_Android","Android_Ice_cream","Book_Fence","Crab_Fusion","System_Flowers","Bird_YouTube","Trees_Hnads","System_Horse","Male_Ice_cream","Nuclear_Drugs","Trees_Book"];

/** simulate API promise **/
const timeOut = function (fn, ms = 300) {
  return setTimeout(fn, ms);
};

function processItem(item) {
  return new Promise(function (resolve, reject) {
    if (!item) {
      reject(item);
      // throw new Error("invalid color value");
    }
    // simulate entry into a DB of some sort with a UID returned
    resolve({
      id: uid.uuid(),
      name: item
    });
    // timeOut(() => {
    //   if (!item) {
    //     reject(item);
    //     // throw new Error("invalid color value");
    //   }
    //   // simulate entry into a DB of some sort with a UID returned
    //   const uid = uuidv4();
    //   resolve({
    //     id: uid,
    //     name: item
    //   });
    // });
  });
}

module.exports = {
  TEST_TITLE,
  TEST_DATA: {
    names
  },
  processItem, 
}