const http = require("http");
const fs = require("fs");
const path = require("path");

let member = fs.readFileSync("members.json", "utf8");
console.log(member);
let memberJson = JSON.parse(member);

for (let i = 0; i < memberJson.length; i++) {
    downloadAvatar(memberJson[i]);
}

function downloadAvatar(member) {
    (async () => {
        // 图片的 URL
        const imageUrl = "http://qlogo1.store.qq.com/qzone/" + member.QQ + "/" + member.QQ + "/" + "100";
        // 本地保存图片的路径
        const localImagePath = path.join(__dirname, "./src/img/avatar/" + member.QQ + ".jpg");

        // 创建一个写入流
        const file = fs.createWriteStream(localImagePath);

        http.get(imageUrl, (response) => {
            // 检查响应状态码
            if (response.statusCode === 200) {
                // 将响应数据写入文件
                response.pipe(file);

                file.on("finish", () => {
                    file.close(() => {
                        console.log("图片下载完成，保存在：" + localImagePath);
                    });
                });
            } else {
                console.error("图片请求失败，状态码：" + response.statusCode);
            }
        }).on("error", (error) => {
            console.error("请求图片时发生错误：" + error.message);
            // 关闭文件流
            file.end();
        });
    })();
}
