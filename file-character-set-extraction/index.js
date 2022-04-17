import fs from 'hexo-fs'
import path from 'path'
import { exec } from 'child_process'

// MAIN
;(async () => {
	//=> CONFIG
	const ScopePath = path.resolve('./ScopeFile') + '/'

	//=> 获取文件列
	const fireArr = await fs.listDir('./ScopeFile')

	//=> 去重
	const rm = mlstr =>
		[...new Set(mlstr)]
			.join('')
			.match(/[^\x00-\xff]+/g)
			.join('')
	//=> 去除注释
	const rmNote = code =>
		code.replace(
			/\/\/.*|\/\*[^]*?\*\/|\/.*?[^\\]\/|''|""|('|")[^]*?[^\\]\1|`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/g,
			m => (m.slice(0, 2) == '//' || m.slice(0, 2) == '/*' ? '' : m)
		)

	//=> 读取文件合并汉字
	let AllFont = ''
	for (let i = 0; i < fireArr.length; i++) {
		const fileName = fireArr[i]
		const filePath = ScopePath + fileName
		const fileContent = await fs.readFile(filePath, { encoding: 'utf8' })
		const unicodeAll = rmNote(fileContent).match(/[^\x00-\xff]+/gim)
		AllFont += unicodeAll?.join('') ?? ''
	}
	AllFont = rm(AllFont)

	//=> 执行命令
	console.log(`java -jar sfnttool.jar -s '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm-:：？！，
    。.,/?-@#$%^&*()（）${AllFont}' .\\fonts\\HarmonyOS_Bold.ttf .\\result.ttf`)
	await exec(
		`java -jar sfnttool.jar -s '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm-:：？！，
    。.,/?-@#$%^&*()（）${AllFont}' .\\fonts\\HarmonyOS_Bold.ttf result.ttf`,
		{},
		err => {
			if (err) conso.error('字集转换失败！')
		}
	)
})()
