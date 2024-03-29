<?php
global $IC;
global $action;
global $itemtype;

$items = $IC->getItems(array("itemtype" => $itemtype, "status" => 1, "order" => "event.host, published_at DESC", "extend" => array("tags" => array("order" => "value ASC"), "mediae" => true)));
$tags = $IC->getTags(array("context" => $itemtype, "order" => "value")); 
$days = $IC->getTags(array("context" => "day", "order" => "value DESC")); 


?>

<div class="scene event i:events">

	<h1>Program</h1>

	<div class="filters">
		<ul class="days">
			<li>Onsdag</li>
			<li>Torsdag</li>
			<li>Fredag</li>
		</ul>

		<div class="filter">

			<h2>Søg</h2>
		
			<form class="search">
				<fieldset>
					<div class="field string">
						<input type="text" />
					</div>
				</fieldset>
			</form>

		
			<ul class="tag_list">
<?				if($tags): ?>
<?					foreach($tags as $tag): ?>
						<li><?= $tag["value"] ?></li>
<?					endforeach; ?>
<?				endif; ?>
			</ul>
		
		</div>
	</div>

	<div class="events">

		<ul class="legend">
			<li>Vært</li>
			<li class="event">Event</li>
			<li class="location">Lokation</li>
			<li class="tags">Tags</li>
		</ul>


<?	if($items): ?>
		<ul class="items">
<?		foreach($items as $item): 
			$media = $IC->sliceMedia($item);
	?>

			<li class="item event id:<?= $item["item_id"] ?> <?= arrayKeyValue($item["tags"], "context", "day") !== false ? strtolower($item["tags"][arrayKeyValue($item["tags"], "context", "day")]["value"]) : "" ?> day:<?= arrayKeyValue($item["tags"], "context", "day") !== false ? $item["tags"][arrayKeyValue($item["tags"], "context", "day")]["value"] : "" ?> i:article">

				<h3 class="host"><?= $item["host"] ?></h3>
				<h2 class="name"><?= $item["name"] ?></h2>
				<p class="location" data-longitude="<?= $item["longitude"] ?>" data-latitude="<?= $item["latitude"] ?>"><a href="http://maps.google.dk/maps/place/<?= $item["latitude"] ?>,<?= $item["longitude"] ?>" target="_blank"><?= $item["location"] ?></a></p>

<?			if($item["tags"]): ?>
				<ul class="tags">
<?				foreach($item["tags"] as $item_tag): ?>
<?					if($item_tag["context"] == $itemtype): ?>
					<li><?= $item_tag["value"] ?></li>
<?					endif; ?>
<?				endforeach; ?>
				</ul>
<?			endif; ?>

				<div class="description">
					<div class="media item_id:<?= $item["item_id"] ?> format:<?= $media["format"] ?>"></div>
				
					<div class="text">
						<p><?= $item["description"] ?></p>
						<ul class="action">
							<li>
								<a href="<?= $item["facebook_link"] ?>" target="_blank">Facebook event</a>
							</li>
						</ul>
					</div>

				</div>

			</li>

<?		endforeach; ?>
		</ul>
<?	endif; ?>

		<div class="downloadmap">
			<h3>Download kort</h3>
			<ul class="maps">
				<li><a href="/assets/maps/2015-street-parties-vesterbro.jpg" target="_blank">Vesterbro</a></li>
				<li><a href="/assets/maps/2015-street-parties-noerrebro.jpg" target="_blank">Nørrebro</a></li>
				<li><a href="/assets/maps/2015-street-parties-chr-borg.jpg" target="_blank">Christiansborg</a></li>
			</ul>
		</div>
	</div>

</div>
