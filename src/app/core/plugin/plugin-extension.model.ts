export class PluginExtension{
	name: string; // 扩展点在界面显示的menu/button的名字
	pluginServer: string; // 提供插件服务的后台服务器地址
	pluginPath: string; // 插件页面文件路径，相对于pluginServer
	pluginId: string; // 插件id（重要），每个插件必须唯一
	routePath: string; // 插件提供的router路径
	moduleId: string;  // 模块id,用于加载插件的路由配置
}