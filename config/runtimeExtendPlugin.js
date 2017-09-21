function RuntimeExtendPlugin() {}

module.exports = RuntimeExtendPlugin;

RuntimeExtendPlugin.prototype.constructor = RuntimeExtendPlugin;
RuntimeExtendPlugin.prototype.apply = function(compiler) {
	compiler.plugin("compilation", function(compilation) {
		var mainTemplate = compilation.mainTemplate;

		mainTemplate.plugin("require-extensions", function(source, chunk, hash) {
			if(typeof source === "string" && (chunk.chunks.length > 0 )) {
				source += "\n // expose loaded chunks \n";
				source += (this.requireFn + ".cc = " +  " installedChunks; \n");

			}
			return source;
		});
	});
};
