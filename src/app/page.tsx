// vercel部署项目
// 1.github上创建 four-app 项目，然后将本地项目上传到 github 上
// 2.登录 vercel.com，github 账号关联，关联好后，点击 Install，界面上就会看到 four-app 项目了
// 3.Import 我们这个 four-app 项目，点击 Deploy 部署，出现了漏洞错误，升级了下 next 版本为 15.5.7，然后再次提交就会自动部署了
// 4.这样我们再改写代码后，直接 git commit -am "" 然后直接 git push 后就会自动ci cd 到 vercel 这个平台了，就可以直接在线上访问（https://four-app-mu.vercel.app/）
// postgres数据库
// Postgres是一个开源的关系型数据库管理系统
// Neon是一个为Postgres数据库提供的云平台
// 在你的 vercel 平台上的项目界面，点击 Storage 导航栏，会让你创建数据库Create a database
// 选择 Neon，点击 Create，Accept and Create -> Create -> 创建名字four-app-database 点击Create，创建成功
// 然后将 .env.local 中的环境变量拷贝，拷贝之前一定要点击 Show secret 展示密钥，然后拷贝到项目的 .env 文件中
// 然后点击 Open In Neon，在里面创建一个表，点击 Table，点击 + （create table）
// 创建 id、username、password 三个字段，给 table 起名字为 users，然后点击 review and create，然后点击 create
// 这就创建好了，然后添加一些数据，点击 open table，然后点击 add record，添加2条数据后，点击 save changes
// 操作数据库，利用第三方的一个库(@neondatabase/serverless)，可以理解为 orm
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
const sql = neon(`${process.env.DATABASE_URL}`);

export default async function Page() {
  const result = await sql.query("SELECT * FROM users");

  async function createAction(formData: FormData) {
    "use server";
    const username = formData.get("username");
    const password = formData.get("password");
    await sql.query("INSERT INFO users (username, password) VALUES ($1, $2)", [
      username,
      password,
    ]);
    revalidatePath("/");
  }

  return (
    <div>
      hello page 01
      <div>
        <form action={createAction}>
          <div>
            用户名：
            <input type="text" className="border" name="username" />
          </div>
          <div>
            密码：
            <input type="text" className="border" name="password" />
          </div>
          <button type="submit">注册</button>
        </form>
      </div>
      <ul>
        {result.map((item) => (
          <li key={item.id}>
            {item.username},{item.password}
          </li>
        ))}
      </ul>
    </div>
  );
}
