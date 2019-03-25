window.onload = function () {

	// globals
	var picsum;
	var urlPic = "https://picsum.photos/300/300?image=";

	Main();
	class ImageBox {
		constructor(secid, stIdx, galleryid, numImageBoxes) {
			
			if (stIdx > picsum.length - 1)
				stIdx -= picsum.length
			this.curIdx = stIdx;
			this.gallery = galleryid;
			this.numImageBoxes = numImageBoxes;

			this.active = false;
			this.IsClicked = false;
			this.variableSleep = 0;

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
			figure.addEventListener("click", function () {
				figure.ImageBox.Click();
			});

			// create wrapper for image
			var figimg = document.createElement("div");
			figimg.classList = "fig__img";

			// create image
			var src = urlPic + picsum[this.curIdx].id;
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
			
			// Append all elements
			cap.appendChild(auth);
			cap.appendChild(link);

			figure.appendChild(figimg);
			figure.appendChild(cap);

			sec.appendChild(figure);
			document.getElementById(this.gallery).appendChild(sec);

			// Add the images to the object
			this.img = img;
			this.author = auth;
			this.link = link;

			this.fig = figure;
			this.sec = sec
			
			// finally set the position
			this.SetPosition();
		}

		AlterHTML() {
			if (this.IsClicked == false)
			{
				this.SetPosition();

				// Get the next image
				this.curIdx += this.numImageBoxes;
				if (this.curIdx > picsum.length - 1)
					this.curIdx -= picsum.length;

				// change the image
				var src = urlPic + picsum[this.curIdx].id;
				this.img.setAttribute("src", src);

				// author
				this.author.innerText = "Author: " + picsum[this.curIdx].author;

				// link
				this.link.setAttribute("href", picsum[this.curIdx].post_url)
			}
			else
			{
				this.fig.style.opacity = "1";
			}
		}

		// set the position in a variable positioning to add more random like style
		async SetPosition() {
			// rightleft
			var rightleft = Math.random();
			var stepValue = 25;
			if (Math.round(rightleft) == 1)
			{
				this.fig.style.right = Math.round(rightleft * stepValue) + "px";
				this.fig.style.left = "";
			}
			else
			{
				this.fig.style.right = "";
				this.fig.style.left = Math.round(rightleft * stepValue) + "px";
			}

			await sleep(35);

			// topbottom
			var topbottom = Math.random();
			if (Math.round(topbottom) == 1)
			{
				this.fig.style.top = Math.round(topbottom * stepValue) + "px";
				this.fig.style.bottom = "";
			}
			else
			{
				this.fig.style.top = "";
				this.fig.style.bottom = Math.round(topbottom * stepValue) + "px";
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
			}
			this.fig.classList.toggle("fig--selected");
		}

		IsActive() {
			return this.active;
		}

		// Forever loop through pictures
		async Loop() {
			var first = true;
			while (true)
			{
				// sleeps based on the random showing time that is in the fade function
				if (!first)
					await sleep(6035 + this.variableSleep);
				else
					first = false;
				this.Fade();
			}
		}

		// start the animation sequence
		async Begin() {
			this.active = true;
			this.isFading = true;
			this.Loop();
		}

		async Fade() {
			if (this.IsClicked == false)
			{
				// doing fading effect while the image is not clicked
				await sleep(500);
				this.fig.style.opacity = "1";

				this.variableSleep = Math.round(Math.random() * 50);
				await sleep(3000 + this.variableSleep);

				if (this.IsClicked == false)
				{
					this.fig.style.opacity = "0";
					await sleep(2500);
					this.AlterHTML();
				}
			}
			else
			{
				// if the image is clicked bring to opacity to 1
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
		return arr.filter(function (ele) {
			return ele != cond;
		});

	}

	// This randomly selects a box from the list of potential boxes and shows them on the page to make it look random
	async function BuildBoxes() {
		var numBoxes = 10
		var stboxidx = Math.round(Math.random() * (picsum.length - 1));
		var boxes = [];
		for (var i = 0; i < numBoxes; i++)
		{
			boxes.push(new ImageBox(i, stboxidx++, "galleryholder", numBoxes));
		}

		var boxesStarting = true;
		var tmp = boxes;
		while (boxesStarting)
		{
			if (tmp.length != 0)
			{
				// picks a random idx in the remaining boxes
				var idx = Math.round(Math.random() * tmp.length);
				if (tmp[idx] != null && tmp[idx].IsActive() == false)
				{
					tmp[idx].Begin();
					tmp = RemoveFromArray(tmp, idx);
				}
				// sleep to give them a nice presence of appearing at different moments.
				await sleep(100);
			}
			else
			{
				// end the loop
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