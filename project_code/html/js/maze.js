var punchHoles = true;

var NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3;

var maze = generateMaze(120, 120);

function generateMaze(width, height)
{
   /**
    * Create a maze!  Create a square array, then draw in the left and top sides:
    *
    *   ooooooooo
    *   o
    *   o
    *   o
    *   o
    *   o
    *   o
    *   o
    *   o
    */

   // Create an array of the appropriate height and width.
   var maze = new Array(height);

   for (var i = 0; i < height; i++)
   {
      maze[i] = new Array(width);

      for (var j = 0; j < width; j++)
      {
         maze[i][j] = 0;
      }
   }

   // Fill in the top and left side.
   for (var x = 0; x < width; x += 1)
   {
      maze[0][x] = 1;
   }

   for (var y = 0; y < height; y += 1)
   {
      maze[y][0] = 1;
   }

   return divide(maze, 0, 0, width, height);
}

function divide(maze, startX, startY, endX, endY)
{
   log("Dividing cell with x-values (" + startX + "-" + endX + "), y-values (" + startY + "-" + endY + ").");

   /**
    * Draw the insides of the maze, using the recursive division method.  Pick out X and Y locations
    * so we can draw the initial walls:
    *
    *   oooooooo
    *   o   o
    *   o   o
    *   o   o
    *   oooooooo  <-- y = wallY
    *   o   o
    *   o   o
    *   o   o
    *
    *       |
    *       |
    *       x = wallX
    */

   // Pick an X and Y location to draw the walls.
   var wallX = wallAt(startX, endX);
   var wallY = wallAt(startY, endY);

   log("Picked wall X at " + wallX + ", wall Y at " + wallY + ".");

   for (var x = startX; x < endX; x += 1)
   {
      maze[wallY][x] = 1;
   }

   for (var y = startY; y < endY; y += 1)
   {
      maze[y][wallX] = 1;
   }

   /**
    * We have a cell that looks like:
    *
    *   oooooooo   <-- y = 0
    *   o   o
    *   o   o
    *   o   o
    *   oooooooo   <-- y = wallY
    *   o   o
    *   o   o
    *   o   o
    *
    * We want to punch holes three out of the four walls, so it looks like, for example:
    *
    *   oooooooo
    *   o   o
    *   o   o
    *   o
    *   o oooooo
    *   o
    *   o   o
    *   o   o
    *
    */

   if (punchHoles)
   {
      var skip = random(0, 3);

      if (skip == NORTH)
      {
         log("No hole in North wall.")
      }
      else
      {
         /**
          * Punch a hole in the North wall.
          *
          *   oooooooo   <-- y = 0
          *   o   x
          *   o   x
          *   o   x
          *   oooooooo   <-- y = wallY
          *   o   o
          *   o   o
          *   o   o
          *
          * We randomly pick a y-value from [1, 3, 5, ..., wallY - 1].
          */
         var hole = punchAt(startY + 1, wallY - 1);

         maze[hole][wallX] = 0;
      }

      if (skip == EAST)
      {
         log("No hole in East wall.")
      }
      else
      {
         /**
          * Punch a hole in the East wall.
          *
          *   oooooooo
          *   o   o
          *   o   o
          *   o   o
          *   oooooxxx
          *   o   o
          *   o   o
          *   o   o
          *
          * We randomly pick a y-value from [wallX + 1, wallX + 3, ..., width - 1].
          */

         var hole = punchAt(wallX + 1, endX - 1);

         maze[wallY][hole] = 0;
      }

      if (skip == SOUTH)
      {
         log("No hole in South wall.")
      }
      else
      {
         /**
          * Punch a hole in the South wall.
          *
          *   oooooooo
          *   o   o
          *   o   o
          *   o   o
          *   oooooooo
          *   o   x
          *   o   x
          *   o   x
          *
          * We randomly pick a y-value from [wallY + 1, wallY + 3, ..., height - 1].
          */

         var hole = punchAt(wallY + 1, endY - 1);

         maze[hole][wallX] = 0;
      }

      if (skip == WEST)
      {
         log("No hole in West wall.")
      }
      else
      {
         /**
          * Punch a hole in the West wall.
          *
          *   oooooooo
          *   o   o
          *   o   o
          *   o   o
          *   oxxxoooo
          *   o   o
          *   o   o
          *   o   o
          *
          * We randomly pick a y-value from [1, 3, 5, ..., wallX - 1].
          */
         var hole = punchAt(startX + 1, wallX - 1);

         maze[wallY][hole] = 0;
      }
   }

   /**
    * Continue to divide the four cells we have created, if they are sufficiently large.
    */
   if (wallY - startY > 3 && wallX - startX > 3)
   {
      log("Dividing NORTH WEST cell.");

      divide(maze, startX, startY, wallX, wallY);
   }

   if (wallY - startY > 3 && endX - wallX > 3)
   {
      log("Dividing NORTH EAST cell.");

      divide(maze, wallX, startY, endX, wallY);
   }

   if (endY - wallY > 3 && endX - wallX > 3)
   {
      log("Dividing SOUTH EAST cell.");

      divide(maze, wallX, wallY, endX, endY);
   }

   if (endY - wallY > 3 && wallX - startX > 3)
   {
      log("Dividing SOUTH WEST cell.");

      divide(maze, startX, wallY, wallX, endY);
   }

   return maze;
}

function random(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function wallAt(a, b)
{
    return a + 2 * random(1, ((b - a) - 2) / 2);
}

function punchAt(a, b)
{
    return a + 2 * random(0, (b - a) / 2);
}

function log(message)
{
   console.log(message);
}

function clone(array)
{
   var copy = new Array(array.length)

   for (var i = 0; i < array.length; i++)
   {
      copy[i] = array[i].slice(0);
   }

   return copy;
}
