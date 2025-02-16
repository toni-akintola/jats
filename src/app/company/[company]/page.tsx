"use client";

import Head from "next/head";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypewriterText } from "@/components/ui/typewriter-text";

const CompanyData = {
  company: "NVIDIA",
  researchModules: [
    {
      moduleName: "Financial Research",
      moduleDescription:
        "Analyze financial health, stock performance, and funding",
      data: {
        stockPrice:
          "NVIDIA's stock price is $129.84, reflecting a recent increase of 0.90%.",
        fundingRounds:
          "NVIDIA raised $5 million in their latest funding round on May 26, 2023. Investors include CPP Investments and Sutter Hill Ventures among 34 others. Additionally, NVIDIA invested $1 billion in AI companies in 2024, participating in 50 startup funding rounds.",
        secFilings:
          "NVIDIA's recent SEC filings include a Schedule 13G/A filed on February 14, 2025, and a 13F portfolio filing for Q4 2024 with a holdings value of $304,524,000.",
      },
    },
    {
      moduleName: "Market Research",
      moduleDescription:
        "Analyze market sentiment, news, and competitive landscape",
      data: {
        newsSentiment:
          "The overall news sentiment for NVIDIA is mixed. While there is positive news regarding Morgan Stanley reaffirming NVIDIA as a top pick and highlighting its strong near-term business, there are also concerns about export controls and AI investment shifts. Additionally, there are reports of negative sentiment due to fears of a slowdown in AI spending and investor caution.",
        socialSentiment:
          "The aggregated social media sentiment for NVIDIA is generally positive, with a sentiment score of 75 out of 100 according to data from top investing forums. However, there is a divide in investor sentiment ahead of NVIDIA's earnings report, and there has been a significant increase in negative mentions on social media.",
        competitorComparison:
          "NVIDIA faces competition from several key players in the market. Top competitors include AMD, Intel, Qualcomm, Broadcom, Xilinx, Hewlett Packard, Asus, Ambarella, Renesas, and Texas Instruments. Additionally, tech giants like Google, Amazon, and Microsoft are developing their own AI chips, which could pose a significant challenge to NVIDIA's market share.",
      },
    },
    {
      moduleName: "People Research",
      moduleDescription: "Analyze workforce, leadership, and talent dynamics",
      data: {
        leadershipChanges:
          "Jensen Huang, the CEO of NVIDIA, continues to lead the company with a unique approach, emphasizing relentless dedication and high expectations from employees. His leadership has transformed NVIDIA into a powerhouse in accelerated computing and AI. Huang's philosophy focuses on pushing boundaries and fostering a culture of innovation and efficiency.",
        jobPostings:
          "NVIDIA currently has 504 open positions listed on Glassdoor, with roles including software engineers, data scientists, and solutions engineers. The company is actively hiring across various departments, reflecting its ongoing growth and expansion in the tech industry.",
        employeeSentiment:
          "Employee sentiment at NVIDIA is generally positive, with 88% of reviews being favorable. The company has an overall rating of 4.5 out of 5 on Glassdoor, with 92% of employees recommending it as a good place to work. However, there are reports of high stress and long work hours, driven by internal competition and high expectations.",
      },
    },
    {
      moduleName: "Product Research",
      moduleDescription:
        "Analyze product development, tech stack, and innovation",
      data: {
        githubActivity:
          "NVIDIA Ingest is an early access set of microservices for parsing hundreds of thousands of complex, messy unstructured PDFs and other enterprise documents into metadata and text to embed into retrieval systems. NVIDIA/nv-ingest's past year of commit activity. Python 2,488 Apache-2.0 214 67",
        apiChanges:
          "The FP16 and BF16 scaled dot-product attention (SDPA) engine with variable sequence length has a regression from cuDNN version 9.3.0 where enabling zero-sequence-length values results in an illegal instruction error. In the backend API, convolution forward engine with CUDNN_ATTR_ENGINE_GLOBAL_INDEX=1 is not supported when the product (channels * height * width) of the input image exceeds 536,870,912 which is 2^29. Expanded support of FP16 and BF16 Fused Flash Attention by adding the sliding window attention feature on NVIDIA Ampere and Hopper GPUs.",
        productInnovation:
          "At CES 2025, Nvidia's CEO, Jensen Huang, unveiled a suite of AI innovations in his keynote speech that span consumer graphics, enterprise computing, specialised AI applications, high-end gaming, industrial robotics and autonomous vehicles - all in aim to significantly advance the frontier of consumer and enterprise computing. Jensen explained the complexity of building autonomous vehicles: \"Building autonomous vehicles, like all robots, requires three computers: Nvidia DGX to train AI models, Omniverse to test drive and generate synthetic data and DRIVE AGX, a supercomputer in the car.\" These innovations set the stage for Nvidia's latest project: a personal AI supercomputer called Project DIGITS, further solidifying the company's position at the forefront of AI technology.",
      },
    },
  ],
};

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState(
    CompanyData.researchModules[0].moduleName,
  );
  const [viewedTabs, setViewedTabs] = useState<string[]>([]);
  const [animatingTab, setAnimatingTab] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setViewedTabs((prev) => [...prev, activeTab]);
    setActiveTab(tab);
    if (!viewedTabs.includes(tab)) {
      setAnimatingTab(tab);
    }
  };

  const handleAnimationComplete = (moduleName: string) => {
    if (animatingTab === moduleName) {
      setViewedTabs((prev) => [...prev, moduleName]);
      setAnimatingTab(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{CompanyData.company} Research | AI Insights</title>
        <meta
          name="description"
          content={`Comprehensive research on ${CompanyData.company}`}
        />
      </Head>

      <h1 className="text-4xl font-bold mb-8">
        <TypewriterText
          text={`${CompanyData.company} Research`}
          speed={50}
          startDelay={0}
        />
      </h1>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          {CompanyData.researchModules.map((module) => (
            <TabsTrigger key={module.moduleName} value={module.moduleName}>
              {module.moduleName}
            </TabsTrigger>
          ))}
        </TabsList>
        {CompanyData.researchModules.map((module) => (
          <TabsContent key={module.moduleName} value={module.moduleName}>
            <Card>
              <CardHeader>
                <CardTitle>{module.moduleName}</CardTitle>
                <CardDescription>{module.moduleDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(module.data).map(([key, value], index) => {
                  const isLastItem =
                    index === Object.entries(module.data).length - 1;
                  return (
                    <div key={key} className="mb-4">
                      <h3 className="text-lg font-semibold capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </h3>
                      <p>
                        {!viewedTabs.includes(module.moduleName) ? (
                          <TypewriterText
                            text={value}
                            speed={20}
                            startDelay={index * 1000 + 1500}
                            onComplete={
                              isLastItem
                                ? () =>
                                    handleAnimationComplete(module.moduleName)
                                : undefined
                            }
                          />
                        ) : (
                          value
                        )}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
