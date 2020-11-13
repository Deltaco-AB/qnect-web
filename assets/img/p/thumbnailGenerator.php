<?php

    // Forked from WIX-generator

    // Generate thumbnail from image
    class Thumbnail {

        private static $destination = "./thumb/";
        private static $publicURL = "./thumb/";

        private static $config = [
            "propSize" => 800, // Square proportional size (scale image to this size)
            "propOffset" => 0 // Aspect ratio proportional offset
        ];

        function __construct($image) {
            $this->source = ["url" => $image];
            $this->image = $this->setImageParams($image);
            $this->url = Thumbnail::$publicURL.$this->image["name"];
            $this->selfcheck();
        }

        // Verify installation dependencies
        private function selfcheck() {
            if(!extension_loaded("gd")) {
                throw new Exception("Please install GD to continue (https://www.php.net/manual/en/intro.image.php)");
            }

            return true;
        }

        private function setImageParams($url) {
            // Explode all parts of URL to arrray
            $index = explode("/",$url);

            // Extract item ID from image name
            $product = end($index);
            $product = str_replace(".png",".jpg",$product);

            return [
                "name" => $product,
                "path" => Thumbnail::$destination.$product
            ];
        }

        // Save image from SharePoint to disk
        private function saveSourceImage() {
            if(!file_put_contents($this->image["path"],file_get_contents($this->source["url"]))) {
                throw new Exception("Failed to save source image. Check permissions for: ".Thumbnail::$destination);
            };

            // Get image metadata
            list($width,$height,$type,$attr) = getimagesize($this->image["path"]);

            $this->source = [
                "url" => $this->source["url"],
                "width" => $width,
                "height" => $height,
                "type" => $type,
                "attr" => $attr
            ];

            if(!$this->source["width"] && !$this->source["height"]) {
                throw new Exception("Failed to set metadata. Assuming something went wrong");
            }

            return true;
        }

        /*
        * Calculate what the resolution must be for image to fit within target size
        * Attempt to center the new image within target size by providing a X,Y offset
        */
        private function getPropResolution() {
            $offsetY = 0;
            // Aspect ratio X:Y where X > Y
            if($this->source["width"] > $this->source["height"]) { 
                $width = Thumbnail::$config["propSize"];
                // Respect aspect ratio
                $height = round($this->source["height"] / $this->source["width"] * Thumbnail::$config["propSize"]);
                // Set the offset
                $offsetY = ceil(($width - $height) / 2);
                $offsetX = Thumbnail::$config["propOffset"] / 2;
            } 
            // Aspect ratio X:Y where X < Y
            elseif($this->source["height"] > $this->source["width"]) {
                $height = Thumbnail::$config["propSize"];
                $width = round($this->source["width"] / $this->source["height"] * Thumbnail::$config["propSize"]);
                $offsetX = ceil(($height - $width + Thumbnail::$config["propOffset"]) / 2);
            } 
            // Aspect ratio X:Y where X = Y
            else {
                $width = $height = Thumbnail::$config["propSize"];
                $offsetX = $offsetY = 0;
            }

            return [
                "width" => $width,
                "height" => $height,
                "offsetX" => $offsetX,
                "offsetY" => $offsetY
            ];
        }

        // Scale image to target size
        private function resample() {
            $target = $this->getPropResolution(); // Calculate image resolution (maintain aspect ratio)

            $construct = imagecreatefrompng($this->image["path"]); // New image constructor
            $canvas = imagecreatetruecolor(Thumbnail::$config["propSize"] + Thumbnail::$config["propOffset"], Thumbnail::$config["propSize"]); // New canvas with 24-bit colors

            // Set and fill canvas with RGB background color
            $bg = imagecolorallocate($canvas,255,255,255);
            imagefill($canvas,0,0,$bg);

            imagecopyresampled($canvas,$construct,$target["offsetX"],$target["offsetY"],0,0,$target["width"],$target["height"], $this->source["width"], $this->source["height"]); // Resample image to target size
            imagejpeg($canvas,$this->image["path"],100); // Save resampled image as JPG
        }

        // Generate a thumbnail
        public function generate($force = FALSE) {
            if($force !== TRUE && file_exists($this->image["path"])) {
                return $this->url;
            }

            $this->saveSourceImage();
            $this->resample();

            return $this->url;
        }

    }

    $files = scandir("./orig");

    foreach($files as $file) {
        if(is_dir($file)) continue;

        try {
            $thumb = new Thumbnail("./orig/".$file,true);
            echo $thumb->generate().PHP_EOL;
        } catch(Exception $error) {
            echo "Caught exception while trying to generate thumbnail: ". $error->getMessage();
            break;
        }
    }

    /*
    try {
        $thumb = new Thumbnail("SH-DB01-QNE.png",true);
        echo $thumb->generate();
    } catch(Exception $error) {
        echo "Caught exception while trying to generate thumbnail: ". $error->getMessage();
    }*/