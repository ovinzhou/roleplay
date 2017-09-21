var ConcatSource = require("webpack-core/lib/ConcatSource");
var Template = require("webpack/lib/Template");

function ChunkIdConverterPlugin() {}

module.exports = ChunkIdConverterPlugin;

ChunkIdConverterPlugin.prototype.constructor = ChunkIdConverterPlugin;
ChunkIdConverterPlugin.prototype.apply = function(compiler) {
	compiler.plugin("compilation", function(compilation) {
		var chunkTemplate = compilation.chunkTemplate;

		chunkTemplate.plugin("render", function(chunkSource, chunk) {
			if(chunkSource.children.length <= 0){
				return chunkSource;
			}

			if(chunk.modules.some(function(module) {
					return module.id === 0;
				})) {
				return chunkSource;
			}

			var jsonpFunction = this.outputOptions.jsonpFunction || Template.toIdentifier("webpackJsonp" + (this.outputOptions.library || "")),
				replacedItemIndex = 0,
				replaceItem;


			for (; replacedItemIndex < chunkSource.children.length; replacedItemIndex++) {
				if((typeof chunkSource.children[replacedItemIndex] === "string") && (chunkSource.children[replacedItemIndex].indexOf(jsonpFunction) >= 0)){
					break;
				}
			};

			if(replacedItemIndex >= chunkSource.children.length ){
				return chunkSource;
			}

			replaceItem = chunkSource.children[replacedItemIndex].replace(chunk.id, "'" + chunk.name + "'");

			chunkSource.children.splice(0,1,replaceItem);

			return chunkSource;
		});
	});
};
