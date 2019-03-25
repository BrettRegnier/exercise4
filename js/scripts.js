window.onload = function () {

	// globals
	var picsum;

	Main();
	class ImageBox {
		constructor(secid, stIdx, galleryid, numImageBoxes) {
			this.curIdx = stIdx;
			this.gallery = galleryid;
			this.numImageBoxes = numImageBoxes;
			
			this.active = false;
			this.IsClicked = false;

			this.CraftHTML(secid);
		}

		CraftHTML(secid) {
			// Create section for gallery
			var sec = document.createElement("div");
			sec.id = secid;
			sec.classList = "imgsection";

			// create figure that goes into the section
			var figure = document.createElement("figure");
			figure.classList = "fig";
			figure.style.opacity = "0";
			figure.ImageBox = this;
			
			if (Math.round(Math.random()) == 1)
			{
				// do right
				figure.style.right = 0;
				figure.style.bottom = "";
			}
			else
			{
				// do bottom
				figure.style.bottom = 0;
				figure.style.right = "";
			}
			
			figure.addEventListener("click", function() {
				figure.ImageBox.Click();
			});

			// create wrapper for image
			var figimg = document.createElement("div");
			figimg.classList = "fig__img";

			// create image
			var src = "https://picsum.photos/300/300?image=" + picsum[this.curIdx].id;
			var img = document.createElement("img");
			img.setAttribute("src", src);

			// place the image into the wrapper
			figimg.appendChild(img);

			// Create the caption for the figure
			var cap = document.createElement("figcaption");
			cap.classList = "fig__cap";

			// Create the author and the link
			var auth = document.createElement("span");
			auth.classList = "fig__author";
			auth.innerText = "Author: " + picsum[this.curIdx].author;
			var link = document.createElement("a");
			link.classList = "fig__link";
			link.setAttribute("href", picsum[this.curIdx].post_url)
			link.innerText = "Image source";

			cap.appendChild(auth);
			cap.appendChild(link);

			figure.appendChild(figimg);
			figure.appendChild(cap);

			sec.appendChild(figure);
			document.getElementById(this.gallery).appendChild(sec);

			this.img = img;
			this.author = auth;
			this.link = link;

			this.fig = figure;
			this.sec = sec
		}

		AlterHTML() {
			if (this.IsClicked == false)
			{		
				
				if (Math.round(Math.random()) == 1)
				{
					// do right
					this.fig.style.right = 0;
					this.fig.style.bottom = "";
				}
				else
				{
					// do bottom
					this.fig.style.bottom = 0;
					this.fig.style.right = "";
				}
				// Get the next image
				this.curIdx += this.numImageBoxes;
				if (this.curIdx > picsum.length - 1)
				this.curIdx = this.curIdx - (picsum.length + 1);
				
				// change the image
				var src = "https://picsum.photos/300/300?image=" + picsum[this.curIdx].id;
				this.img.setAttribute("src", src);
				
				// author
				this.author.innerText = "Author: " + picsum[this.curIdx].author;
				
				// link
				this.link.setAttribute("href", picsum[this.curIdx].post_url)
				
				
				this.Fade();
			}
			else
			{
				this.fig.style.opacity = "1";
			}
		}

		Click() {
			if (this.IsClicked == false)
			{
				this.IsClicked = true;
				this.fig.style.opacity = "1";
			}
			else
			{
				this.IsClicked = false;
				this.Fade();
			}
			this.fig.classList.toggle("fig--selected");
		}
		
		IsActive() {
			return this.active;
		}

		async Begin() {
			this.active = true;
			this.Fade();
		}
		
		async Fade() {
			if (this.IsClicked == false)
			{	
				await sleep(500);
				this.fig.style.opacity = "1";
				await sleep(3000);
				if (this.IsClicked == false)
				{
					this.fig.style.opacity = "0";
					await sleep(2500);
					this.AlterHTML();
				}
			}
			else
			{
				this.fig.style.opacity = "1";
			}
		}
	};

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	// https://love2dev.com/blog/javascript-remove-from-array/
	// Got it here.
	function RemoveFromArray(arr, cond) {
	   return arr.filter(function(ele){
		   return ele != cond;
	   });
	
	}
	
	async function BuildBoxes()
	{
		var numBoxes = 10
		var boxes = [];
		for (var i = 0; i < numBoxes; i++)
		{
			boxes.push(new ImageBox(i, i, "galleryholder", numBoxes));
		}	
		
		var boxesStarting = true;
		var tmp = boxes;
		while (boxesStarting)
		{
			if (tmp.length != 0)
			{
				
				var idx = Math.round(Math.random() * tmp.length); 
				if (tmp[idx] != null && tmp[idx].IsActive() == false)
				{
					tmp[idx].Begin();
					tmp = RemoveFromArray(tmp, idx);
				}
				await sleep(100);
			}
			else
			{
				boxesStarting = false
			}
		}
	}

	function Main() {

		var xhr = new XMLHttpRequest();

		xhr.open("GET", "https://picsum.photos/list", true);

		xhr.send(null);

		xhr.onload = function () {
			if (xhr.status == 200)
			{
				picsum = JSON.parse(xhr.responseText);
				BuildBoxes();
			}
		};
	}
}