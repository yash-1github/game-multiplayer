var input;
var button;
var heading;
var db;// var for database
var gs = 0, pc = 0 //game state and player count variables
var car1 , car2 , car3, car4;//defining car vars
var limit, intpos;
var carnumberdecider = 0;
var cararray = [];
var ranking = 0;
var lim;  
var result;
var gamecode;


function preload(){

bg = loadImage("formbg.jpg"); 
trackimg = loadImage("image/track.jpg");
car1img = loadImage("image/car1.png");
car2img = loadImage("image/car2.png");
car3img = loadImage("image/car3.png");
car4img = loadImage("image/car4.png");
}
 
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);//1520,750

  //settingup database
  db = firebase.database();
  
  db.ref("gameState").on("value" , function(data){
    gs = data.val();
  })

  db.ref("playerCount").on("value" , function(data){
    pc = data.val();
  })

  db.ref("rank").on("value" , function(data){
    ranking = data.val();
  })

  result = Math.round(random(100000, 999999));
  db.ref("/").update({ 
    gc : result
  })

  db.ref("gc").on("value" , function(data){
    gamecode = data.val()
  })
  

  
//creating a join
join = createButton();
join.html("JOIN A GAME");
join.style( "backgroundColor" , "YELLOW");
join.style( "borderRadius", "10px");
join.style("width", "100px");
join.style("height", "50px");
join.position(window.innerWidth/2-200   , window.innerHeight/2 );
join.mousePressed(joinplayer);

//creating a create
create = createButton();
create.html("CREATE A GAME");
create.style( "backgroundColor" , "YELLOW");
create.style( "borderRadius", "10px");
create.style("width", "100px");
create.style("height", "50px");
create.position(window.innerWidth/2  +200 , window.innerHeight/2 );
create.mousePressed(createplayer);



 
  
//create a reset button
  reset = createButton();
  reset.html("RESET");
  reset.style( "backgroundColor" , "red");
  reset.style( "borderRadius", "10px");
  reset.style("width", "100px");
  reset.style("height", "50px");
  reset.position(window.innerWidth - 150 , window.innerHeight - 100);


//cerating heading
  heading = createElement("h1");
  heading.html("MULTIPLAYER CAR RACING GAME")
  heading.style("color", "yellow")
  heading.position( window.innerWidth/2 - 300, window.innerHeight/ window.innerHeight + 100);
  
  reset.mousePressed(resetdb);

  car1 = createSprite(410,600,20,50);
  car1.addImage("label" , car1img);
  car2 = createSprite(650,600,20,50);
  car2.addImage("label" , car2img);
  //car3 = createSprite(900,600,20,50);
  //car3.addImage("label" , car3img);
  //car4 = createSprite(1250,600,20,50);
  //car4.addImage("label" , car4img);

  cararray = [car1 , car2  ];//DONT FORGET TO ADD CAR 3 AND CAR 4


}

function draw() {

  if(gs === 0){
  background(bg);  
  }
  
  if(gs===1 && limit===undefined){//reading the initial position from the DB
    db.ref("players").on("value" , function(data){
      intpos =  data.val();
    })
    limit = 4;
  }


///YAHAN PAR PASTE KARNA
  if(pc === 2){
    gs= 1;
    db.ref("/").update({gameState  : gs}) 
   }




  if(gs===1){
    var index = 0;
    background(rgb(65,64,66));
    image(trackimg, 0, -window.innerHeight, window.innerWidth ,window.innerHeight * -5);
     for(var i in intpos){
          cararray[index].y = intpos[i].y;
          if(index === carnumberdecider -1 ){
            fill("black");
          text(nameinput.value() , cararray[carnumberdecider-1].x-20 , cararray[carnumberdecider-1].y + 60);  
          camera.position.y = cararray[carnumberdecider -1].y; }
          index = index+1;  
     }
     
     if(keyDown("up")){
       for(var i = 1; i<10; i += 5){
       cararray[carnumberdecider - 1].y = cararray[carnumberdecider - 1].y - 2*i;
       }
       db.ref("players/player" + carnumberdecider).update({y : cararray[carnumberdecider -1 ].y}) ;
     }

    if( cararray[carnumberdecider-1]. y < -4355  && lim === undefined ){
       
      ranking++ ; 
      db.ref("/").update({ rank : ranking});
      alert("YOU HAVE WON \n YOUR RANK IS : " + ranking)  ; 
      lim = 0  ;
    }

  if(ranking === 2){
      db.ref("/").update({playerCount : 0, gameState : 0 , rank:0 ,gc :0});
      window.location.reload();
      db.ref("players").remove();
  }
      
  
      
    
    greeting.hide();
    heading.hide();
    drawSprites();    
  }
}

function regisplayer(){
  pc= pc+1; // can also use pc++ or pc+=1
  carnumberdecider = pc;

  db.ref("/").update({playerCount : pc})
  
  db.ref("players/player" + pc).set({ y : -870 , playername : nameinput.value()})  

  button.hide();
  nameinput.hide();
  input.hide();
  //cerating greeting
  greeting = createElement("h2");
  greeting.html("HELLO  " + nameinput.value() + " WAITING FOR OTHERS TO JOIN........." )
  greeting.position( window.innerWidth/2 - 300, window.innerHeight/ window.innerHeight + 250);

  console.log("hello ");
  code.hide();
}
  
function resetdb(){
  db.ref("/").update({playerCount : 0, gameState : 0 , rank:0 });
  window.location.reload();
  db.ref("players").remove();
}

function joinplayer(){
//creating an input
input = createInput();
input.attribute("placeholder" ,   " ENTER THE GAME CODE ");
input.style("textAlign", "center");
input.style("width", "200px");
input.style("height", "50px");
input.position(window.innerWidth/2 + 350, window.innerHeight/2);

  //creating name input
  nameinput  = createInput();
  nameinput.attribute("placeholder" ,   " ENTER YOUR NAME ");
  nameinput.style("textAlign", "center");
  nameinput.style("width", "200px");
  nameinput.style("height", "50px");
  nameinput.position(window.innerWidth/2 - 500, window.innerHeight/2);


//creating a button 
  button = createButton();
  button.html("SUBMIT");
  button.style( "backgroundColor" , "YELLOW");
  button.style( "borderRadius", "10px");
  button.style("width", "100px");
  button.style("height", "50px");
  button.position(window.innerWidth/2   , window.innerHeight/2 +150);
  button.mousePressed(regisplayer);
  
//input.value().length !==  0 && nameinput.value().length !==  0 &&
  join.hide();
  create.hide();
  if( input.value() === gamecode){
    button.mousePressed(regisplayer);     
    }


}

function createplayer(){

  result = Math.round(random(100000, 999999));

  //creating an input
input = createInput();
input.attribute("placeholder" ,   " ENTER THE GAME CODE ");
input.style("textAlign", "center");
input.style("width", "200px");
input.style("height", "50px");
input.position(window.innerWidth/2 + 350, window.innerHeight/2);

   //creating name input
   nameinput  = createInput();
   nameinput.attribute("placeholder" ,   " ENTER YOUR NAME ");
   nameinput.style("textAlign", "center");
   nameinput.style("width", "200px");
   nameinput.style("height", "50px");
   nameinput.position(window.innerWidth/2 - 500, window.innerHeight/2);

   //creating a button 
  button = createButton();
  button.html("SUBMIT");
  button.style( "backgroundColor" , "YELLOW");
  button.style( "borderRadius", "10px");
  button.style("width", "100px");
  button.style("height", "50px");
  button.position(window.innerWidth/2   , window.innerHeight/2 +150);
  button.mousePressed(regisplayer)


  //game code making 
  code = createElement("h1");
  code.html("YOUR GAME CODE IS :" + result );
  code.position(window.innerWidth/2 + 350, window.innerHeight/2 - 100);

  
  join.hide();
  create.hide();
//input.value().length !==  0 && nameinput.value().length !==  0 &&
  if( input.value() === gamecode){
    button.mousePressed(regisplayer);     
    }

}
