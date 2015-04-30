Util.Objects["front"] = new function() {
	this.init = function(scene) {

		// global resize handler
		scene.resized = function() {
//			u.bug("scene.resized:" + u.nodeId(this));

			var block_height = Math.ceil(this.offsetWidth/5);


			var i, li;
			for (i = 0; li = this.lis[i]; i++) {

				if(li.is_ready) {

					// handle article and instagram items
					if(u.hc(li, "article|instagram")) {
						if(li._forty) {
							u.as(li, "height", (block_height*2)+"px", false);
						}
						else {
							u.as(li, "height", block_height+"px", false);
						}
					}

					// handle tweet items
					if(u.hc(li, "tweet")) {
						u.as(li, "height", block_height+"px", false);
					}


					// handle ambassador
					if(u.hc(li, "ambassador")) {
						// video height
						u.as(li.video, "height", (block_height*2)+"px", false);
						// article height
						u.as(li.article, "height", (block_height*2)+"px", false);
					}


					// handle margins
					if(u.hc(li, "push_up|push_up_half")) {
						u.as(li, "marginTop", -(block_height)+"px", false);
					}
					if(u.hc(li, "push_down")) {
						u.as(li, "marginTop", block_height+"px", false);
					}

				}

			}


			// adjust grid padding
			var factor = (this.offsetWidth - 600) / 600;
			var padding = (10 + (factor * 30))+"px "+(10 + (factor * 20))+"px";
			this.article_rule.style.setProperty("padding", padding, "important");
			this.tweet_rule.style.setProperty("padding", padding, "important");


		}

		// global scroll handler
		scene.scrolled = function() {
			u.bug("page.scrolled:" + u.nodeId(this))

		}

		// scene ready-check
		scene.isReady = function() {
//			u.bug("is almost ready:" + this.is_almost_ready + "," + this.load_image_count + "=" + this.loaded_image_count)
			if(this.is_almost_ready && this.load_image_count == this.loaded_image_count) {
				this.is_ready = true;
				page.cN.ready();
			}
		}

		scene.ready = function() {
			u.bug("scene.ready:" + u.nodeId(this));


			// create padding rule for grid
			this.style_tag = document.createElement("style");
			this.style_tag.setAttribute("media", "all")
			this.style_tag.setAttribute("type", "text/css")
			this.style_tag = u.ae(document.head, this.style_tag);

			this.style_tag.sheet.insertRule("#content .scene.front li.article {}", 0);
			this.article_rule = this.style_tag.sheet.cssRules[0];

			this.style_tag.sheet.insertRule("#content .scene.front li.tweet .card {}", 0);
			this.tweet_rule = this.style_tag.sheet.cssRules[0];


			this.h1 = u.qs("h1", this);


			//this.ul = u.qs(".grid");
			this.lis = u.qsa("ul.grid > li", this);

			this.load_image_count = 0;
			this.loaded_image_count = 0;

			// fill li with dots
			this.fillWithDots = function(li) {

				var insta_svg_object = {
					"width":li.offsetWidth,
					"height":li.offsetHeight,
					"shapes":[]
				};

				li.svg = u.svg(insta_svg_object);
				li.shapes = [];
				u.ae(li, li.svg);
				var j, k = 0;
				var dots_pr_row = li.offsetWidth/30 + 1;
				li.total_dots = Math.pow(dots_pr_row, 2);
				for(j = 0; j < li.total_dots; j++) {

//							u.bug("k:" + k + ", " + j%dots_pr_row)
					if(j%dots_pr_row == 0) {
						k++;
					}

					li.shapes.push(u.svgShape(li.svg, {
						"type":"circle",
						"cx":(30*(j%dots_pr_row)),
						"cy":k*30 - 10,
						"r":20
					}));
				}

			}


			var i, li;
			for (i = 0; li = this.lis[i]; i++) {

				li.scene = this;

				// pre-index
				if(u.hc(li, "forty")) {
					li._forty = true;
				}
				else if(u.hc(li, "sixty")) {
					li._sixty = true;
				}
				else {
					li._twenty = true;
				}


				// handle instagram images
				if(u.hc(li, "instagram")) {

					// img
					li.image = u.qs("div.image", li);
					if(li.image) {
						li.image.li = li;
						li.image.image_id = u.cv(li.image, "image_id");
						li.image.format = u.cv(li.image, "format");

						if(li.image.image_id && li.image.format) {
							li.image.loaded = function(queue) {
								
								this.img = u.ae(this, "img", {"src": queue[0].image.src});
								this.li.scene.loaded_image_count++;
								this.li.scene.isReady();

							}
							li.image._image_src = "/images/" + li.image.image_id + "/image/400x." + li.image.format;
							this.load_image_count++;

							u.preloader(li.image, [li.image._image_src])
						}

					}
				}

				// handle tweet
				if(u.hc(li, "tweet")) {

					li.cards = u.qsa(".card", li);

				}

				// handle article page
				if(u.hc(li, "article")) {

					var link = u.qs("a", li);
					u.ce(link, {"type":"link"});

				}


				// handle ambassador
				if(u.hc(li, "ambassador")) {
					//u.as(li, "height", li.offsetWidth+"px");

					// article
					li.article = u.qs("li.article", li);

					// video
					li.video = u.qs("li.video", li);
					li.video.li = li;

					li.video.video_id = u.cv(li.video, "video_id");
					li.video.video_format = u.cv(li.video, "video_format");

					li.video.image_id = u.cv(li.video, "image_id");
					li.video.image_format = u.cv(li.video, "image_format");

					if(li.video.image_id && li.video.image_format) {
						li.video.loaded = function(queue) {
							u.ae(this, "img", {"src": queue[0].image.src});
							this.li.scene.loaded_image_count++;
							this.li.scene.isReady();
						}

						li.video._image_src = "/images/" + li.video.image_id + "/image/720x." + li.video.image_format;
						u.preloader(li.video, [li.video._image_src])
						this.load_image_count++;
					}


					if(li.video.video_id && li.video.video_format) {

						li.video._video_url = "/videos/" + li.video.video_id + "/video/720x." + li.video.video_format;
						li.video.play_bn = u.ae(li.video, "div", {"class": "play"});

						u.e.click(li.video);
						li.video.clicked = function(event) {

							//u.as(this.play_bn, "display", "none");
							page.videoPlayer.ended = function(event) {
								//console.log("video player is done playing. LOOOP!");
//								page.videoPlayer.play();
							}

							u.ae(this, page.videoPlayer);
							page.videoPlayer.loadAndPlay(this._video_url, {"playpause":true});

						}

					}
				}


				li.is_ready = true;

				// resize grid
				this.resized();

				if(u.hc(li, "instagram|article|ambassador")) {
					this.fillWithDots(li);
				}

			}

			// resize grid
			this.resized();


			u.textscaler(this, {
				"min_width":800,
				"max_width":1200,
				"unit":"px",
				".twenty h2":{
					"min_size":16,
					"max_size":24
				},
				".forty h2":{
					"min_size":24,
					"max_size":48
				},
				".tweet p":{
					"min_size":15,
					"max_size":23
				}
			});


			u.bug("all lis ready")

			this.is_almost_ready = true;
			this.isReady();
//			page.cN.ready();

		}


		// build scene - start actual rendering of scene
		scene.build = function() {

			if(!this.is_built) {
				u.bug("scene.build:" + u.nodeId(this));

				this.is_built = true;


				// mapped to li-node
				this._animate_build = function() {

					var shape, i = 0;
					if(this.shapes.length) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0."+u.random(2,6)+"s linear", this._render);
					}

					if(this.shapes.length) {
					
						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0."+u.random(2,6)+"s linear", this._render);
					}

					if(this.shapes.length) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0."+u.random(2,6)+"s linear", this._render);
					}

					if(this.shapes.length) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0."+u.random(2,6)+"s linear", this._render);
					}

					if(this.shapes.length) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 100) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 100) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 100) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 100) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 300) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 300) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 300) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 300) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 300) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 300) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 300) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 300) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}

					if(this.shapes.length && this.total_dots > 300) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", this._render);
					}


					if(this.shapes.length) {

						i = u.random(0, this.shapes.length-1);
						shape = this.shapes[i];
						this.shapes.splice(i, 1);

						u.a.to(shape, "all 0.3s linear", {"cx":this._center, "cy":this._center, "r":0});

						// continue animation
//						u.a.setOpacity(this.svg, this.svg._opacity ? this.svg._opacity*0.99 : 0.95);

						u.t.setTimer(this, "animate", 10);
					}

				}


				this._rotateCard = function() {

					if(this.cards.length > 1) {
						var new_card = this.card+1 < this.cards.length ? this.card+1 : 0;

						this.cards[this.card].transitioned = function() {
							u.as(this, u.a.vendor("transform"), "rotateX(180deg)");
						}
						u.a.transition(this.cards[this.card], "all 0.5s ease-in-out");
						u.as(this.cards[this.card], u.a.vendor("transform"), "rotateX(-180deg)");

						u.a.transition(this.cards[new_card], "all 0.5s ease-in-out");
						u.as(this.cards[new_card], u.a.vendor("transform"), "rotateX(0)");

						this.card = new_card;

						u.t.setTimer(this, this.rotateCard, 5000);
					}
				}


				for(i = 0; li = this.lis[i]; i++) {

					var li_y = u.absY(li);
					if((li_y > page.scroll_y && li_y < page.scroll_y + page.browser_h) || li_y+li.offsetHeight > page.scroll_y && li_y+li.offsetHeight < page.scroll_y + page.browser_h) {


						if(u.hc(li, "instagram|article|ambassador")) {

							li._center = li.offsetWidth/2;

							// pick random rendering
							var rand = u.random(0,5);
							if(rand == 1) {
								li._render = {"cx":li._center, "cy":li._center, "r":0}
							}
							else if(rand == 2) {
								li._render = {"cx":li.offsetWidth + 30, "r":0}
							}
							else if(rand == 3) {
								li._render = {"cx":-30, "r":0}
							}
							else if(rand == 4) {
								li._render = {"cy":-30, "r":0}
							}
							else if(rand == 5) {
								li._render = {"cy":li.offsetHeight + 30, "r":0}
							}
							else {
								li._render = {"r":0}
							}

							u.a.transition(li, "all 1.5s ease-in-out");
							u.a.setOpacity(li, 1);

							li.animate = this._animate_build;
							li.animate();

						}

						if(u.hc(li, "tweet")) {

							u.a.transition(li.cards[0], "all 0.5s ease-in-out");
							u.as(li.cards[0], u.a.vendor("transform"), "rotateX(0)");
							li.card = 0;

							li.rotateCard = this._rotateCard;

							u.t.setTimer(li, li.rotateCard, 5000);

						}

					}
					else {
						u.a.setOpacity(li, 1);
						if(li.svg) {
							li.svg.parentNode.removeChild(li.svg);
						}
						if(li.cards) {
							u.as(li.cards[0], u.a.vendor("transform"), "rotateX(0)");
							li.card = 0;
							li.rotateCard = this._rotateCard;
							u.t.setTimer(li, li.rotateCard, 5000);
						}
					}

				}
//				u.a.transition(this)

				// u.a.transition(this, "all 1s linear");
				// u.a.setOpacity(this, 1);

			}
		}


		// destroy scene - scene needs to be removed
		scene.destroy = function() {
//			u.bug("scene.destroy:" + u.nodeId(this))

			// destruction is a one time, oneway street
			this.destroy = null;


			// when destruction is done, remove scene from content and notify content.ready
			// to continue building the new scene
			this.finalizeDestruction = function() {

				// remove style tag
				this.style_tag.parentNode.removeChild(this.style_tag);


				this.parentNode.removeChild(this);
				page.cN.ready();

			}

			u.a.transition(this.h1, "all 1s ease-out");
			u.a.setOpacity(this.h1, 0);

			var i, li, j = 0;

			for(i = 0; li = this.lis[i]; i++) {
				var li_y = u.absY(li);
				if((li_y > page.scroll_y && li_y < page.scroll_y + page.browser_h) || li_y+li.offsetHeight > page.scroll_y && li_y+li.offsetHeight < page.scroll_y + page.browser_h) {
					u.bug("move:" + u.nodeId(li))
					u.as(li, "zIndex", 100-j);
					u.a.transition(li, "all 0.3s ease-in "+(150*j++)+"ms");
					u.a.origin(li, li.offsetWidth/2, li.offsetWidth/2);
					u.a.scaleRotateTranslate(li, 0.5, 15, 0, 2000);
					u.a.setOpacity(li, 0);
				}
			}

			u.t.setTimer(this, this.finalizeDestruction, (100*j)+500);

		}



		// ready to start page builing process
		scene.ready();
	}
}
