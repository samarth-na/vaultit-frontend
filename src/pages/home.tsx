import BigTextInput from "../components/BigTextInput";
import Layout from "../components/Layout";

export default function Home({ user }: { user: any }) {
  // console.log(user);

  return (
    <Layout user={user}>
      <div className=" flex flex-col items-center">
        <h1 className="p-8 text-2xl font-serif">
          welcome {user.name}, start writing
        </h1>
        <BigTextInput />
      </div>
    </Layout>
  );
}
