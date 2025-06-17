import { Metadata } from "next";




export async function generateMetaData({ params }: { params: { slug: string } }): Promise<Metadata>{
     const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "api/seo/job-info/"+ params?.slug);
    const data = await response.json();
    return {
        title: data?.title,
        description: data?.description.slice(0, 155)+"...",
        openGraph: {
            images: [
                {
                    url: data?.image,
                    width: 800,
                    height: 600,
                }
            ]
        }
    }
}





export default async function Layout({children, params}:{
    children: React.ReactNode, params:  {slug: string}
}){

  
    return <>
    {
        children
    }
    </>
}