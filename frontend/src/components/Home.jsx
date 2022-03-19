import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActiveKey } from "../store/navbarSlice";
import MythFacts from "./MythFacts";
import vaccine from "../asset/images/Vaccine.png";
import hand from "../asset/images/hand.png";
// import second from "../asset/images/second.png";
// import safe from "../asset/images/safe.png";
// import { AiOutlinePlayCircle } from "react-icons/ai";
import VaxImage from "../asset/images/VaxImage.jpg";
import PregnantImage from "../asset/images/PregnantImage.jpg";
import JabImage from "../asset/images/JabImage.jpg";
import ShieldImage from "../asset/images/SheildImage.jpg";
import SideEffectImage from "../asset/images/SideEffectImage.jpg";
import MaskImage from "../asset/images/MaskImage.jpg";
import SeniorImage from "../asset/images/SeniorImage.jpg";
// import life from "../asset/images/back-to-life.png";
// import moh from "../asset/images/MOHW.png";
// import vac from "../asset/images/vac.png";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeV2() {
  // const [secondPlay, setSecondPlay] = useState(false);
  // const [safePlay, setSafePlay] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveKey("1"));
    // eslint-disable-next-line
  }, []);

  const data = [
    {
      image: VaxImage,
      myth: "The COVID-19 vaccine is not safe because it was rapidly developed.",
      fact: "The vaccine is proven safe and effective. It has gone through the same rigorous processes as every other vaccine, meeting all safety standards.",
    },
    {
      image: PregnantImage,
      myth: "The COVID-19 vaccine causes infertility in women.",
      fact: "No vaccine suspected of impacting a person’s ability to conceive, has ever been or will ever be approved.",
    },

    {
      image: JabImage,
      myth: "Once I receive the vaccine, I will test positive for COVID-19.",
      fact: "Viral tests look for the presence of the virus that causes COVID-19. Since there is no live virus in the vaccine, the vaccine cannot affect your test result. It is possible to get infected with the virus before the vaccine has had time to fully protect your body.",
    },
    {
      image: VaxImage,
      myth: "I have already been diagnosed with COVID-19, so I do not need to get the vaccine.",
      fact: "If you have already had COVID-19, you will still need to take the vaccine as it is not known for how long natural immunity will last. Since COVID-19 can have severe health risks and the possibility of re-infection, the recommendation is to take the vaccine.",
    },

    {
      image: SideEffectImage,
      myth: "The COVID-19 vaccine has severe side effects such as allergic reactions.",
      fact: "Although extremely rare, people can have severe allergic reactions to ingredients used in a vaccine. It is recommended that people with a history of anaphylaxis (severe allergic reaction) to the ingredients of the vaccine should not be vaccinated.",
    },

    {
      image: MaskImage,
      myth: "Once I receive the COVID-19 vaccine, I no longer need to wear a mask.",
      fact: "Mask wearing, hand washing and physical distancing remain necessary until a sufficient number of persons are immune.",
    },

    {
      image: SeniorImage,
      myth: "Only the elderly need to take the vaccine.",
      fact: "Allowing the disease to spread until herd immunity is reached will cause millions of deaths and even more people living with the long term effects of the virus.",
    },
    {
      image: JabImage,
      myth: "You can get COVID-19 from the vaccine.",
      fact: "YOU CANNOT get COVID-19 from the vaccine because it does not contain the live virus.",
    },
    {
      image: ShieldImage,
      myth: "Natural Immunity is better.",
      fact: "Allowing the disease to spread until herd immunity is reached will cause millions of deaths and even more people living with the long term effects of the virus.",
    },
  ];

  return (
    <div layout className="overflow-x-hidden">
      <div className="w-full bg-slate-700 text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-2 py-4 lg:flex-row lg:justify-between lg:space-x-3">
          <div className="max-w-lg space-y-4">
            <h3 className="text-4xl font-bold">
              What you need to know about COVID-19 Vaccines
            </h3>
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img
                src={vaccine}
                alt="doctors"
                className="mt-4 rounded delay-1000 md:max-w-[35rem] lg:hidden"
                loading="eager"
              />
            </motion.div>
            <p className="text-lg">
              Vaccination against COVID-19 is vital to stopping the spread of
              the virus. COVID-19 vaccines have been rigorously tested and
              approved by local and international regulatory bodies and are
              critical to reducing illness, hospitalization and death associated
              with COVID-19.
            </p>
            <div className="flex w-full items-center justify-center lg:justify-start">
              <Link
                className="rounded bg-slate-800 px-8 py-3 hover:scale-105 
              hover:bg-slate-700/95 hover:text-white hover:no-underline hover:shadow-md"
                to="/appointments/create"
              >
                Make an Appointment
              </Link>
            </div>
          </div>
          <motion.div
            layout
            whileInView={{ x: [400, -150, 0] }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <motion.img
              src={vaccine}
              alt="doctors"
              className="mt-4 w-0 rounded delay-1000 md:max-w-[35rem] lg:mt-0 lg:w-full"
              loading="eager"
            />
          </motion.div>
        </div>
      </div>
      {/* <div className="bg-slate-500">
        <motion.div
          className="mx-auto flex max-w-6xl flex-col items-center
         bg-yellow-400 px-4 py-2 shadow-2xl shadow-yellow-400/30 lg:scale-105 lg:flex-row lg:space-x-32 lg:rounded-lg"
          layout
          whileInView={{ scale: [0, 1.1, window.outerWidth > 412 ? 1.05 : 1] }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <img src={life} alt="Vaccination" className="w-[30rem]" />
          <div className="flex items-center space-x-2">
            <img src={moh} alt="Vaccination" className="aspect-auto w-[9rem]" />
            <img src={vac} alt="Vaccination" className="w-[4rem]" />
            <div className="flex flex-col">
              <p className="font-bold text-black">www.moh.gov.jm</p>
              <p className="font-bold text-black">888-ONE-LOVE (663-5683)</p>
              <p className="font-bold text-black">@themohwgovjm</p>
            </div>
          </div>
        </motion.div>
      </div> */}
      <div className=" bg-slate-500 ">
        <div className="mx-auto flex max-w-7xl flex-col space-y-3 px-2 py-4">
          <div className="flex w-full flex-col items-center justify-between space-y-4 text-left text-white md:items-start">
            <p className="text-center text-4xl font-bold">What is a vaccine?</p>
            <p className="max-w-xl text-xl">
              A vaccine is a type of medicine that stimulates a person’s immune
              system to produce immunity to a specific disease, protecting the
              person from the disease.
            </p>
          </div>
          <div className="flex w-full flex-col items-center text-white md:flex-row md:px-12 lg:space-x-8">
            <motion.div
              layout
              whileInView={{ x: [-300, 150, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <img
                src={hand}
                alt="hand"
                loading="lazy"
                className="delay-1000 md:max-w-[30rem]"
              />
            </motion.div>
            <div className="space-y-8">
              <p className="text-3xl font-bold">How do vaccines work?</p>
              <div>
                <p className="text-xl">
                  Vaccines work with your body’s natural defense to build
                  protection. When vaccinated, your immune system is able to:
                </p>
                <ul className="ml-8 list-outside list-disc">
                  <li className="text-lg">
                    Recognize the invading germ ( e.g. virus or bacteria).
                  </li>
                  <li className="text-lg">
                    Produce antibodies that fight and destroy the germ before
                    you become unwell.
                  </li>
                </ul>
              </div>
              <div className="flex w-full items-center justify-center">
                <button
                  className="rounded bg-sky-700 px-8 py-2 hover:scale-105 
                hover:shadow-xl hover:shadow-sky-700/40"
                  onClick={() =>
                    window.open(
                      "https://www.who.int/news-room/feature-stories/detail/how-do-vaccines-work",
                      "_blank"
                    )
                  }
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-slate-800 py-2 px-2 text-white">
        <div className="mx-auto lg:max-w-6xl">
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center space-y-3">
              <p className="text-center text-3xl font-bold">
                Process for Your 2nd Dose
              </p>
              <>
                {secondPlay ? (
                  <div className="aspect-video h-full w-full rounded md:w-[35rem]">
                    <iframe
                      src="https://www.youtube.com/embed/-MTIvHTfGJE"
                      title="Second dose"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full rounded"
                    />
                  </div>
                ) : (
                  <motion.div
                    whileInView={{ x: [-300, 50, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="relative"
                  >
                    <img src={second} alt="second" className="rounded" />
                    <AiOutlinePlayCircle
                      className="absolute left-[40%] top-[35%] h-20 w-20 
                    cursor-pointer rounded-full bg-black/40 p-2 text-white hover:bg-black/50
                     md:top-[40%] md:left-[45%]"
                      onClick={() => setSecondPlay(true)}
                    />
                  </motion.div>
                )}
              </>
            </div>
            <div className="flex flex-col items-center justify-center space-y-3">
              <p className="text-3xl font-bold">Are Vaccines Safe?</p>
              <>
                {safePlay ? (
                  <div className="aspect-video h-full w-full rounded md:w-[35rem]">
                    <iframe
                      src="https://www.youtube.com/embed/9Y7lA82HFGc"
                      title="Are vaccine safe?"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full rounded"
                    />
                  </div>
                ) : (
                  <motion.div
                    whileInView={{ x: [300, -50, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="relative"
                  >
                    <img src={safe} alt="safe" className="rounded" />
                    <AiOutlinePlayCircle
                      className="absolute left-[40%] top-[35%] h-20 w-20 cursor-pointer rounded-full bg-black/40
                     p-2 text-white hover:bg-black/50 md:top-[40%] md:left-[45%]"
                      onClick={() => setSafePlay(true)}
                    />
                  </motion.div>
                )}
              </>
            </div>
          </div>
        </div>
      </div> */}
      <div className="bg-slate-800">
        <div className="mx-auto max-w-7xl px-2 py-3">
          <p className="text-center text-3xl font-bold text-white">COVID-19</p>
          <p className="pb-4 text-center text-4xl text-white">
            Myths and Facts
          </p>
          <AnimatePresence>
            <motion.div
              layout
              className="flex flex-wrap justify-center gap-1.5 overflow-hidden lg:px-8 lg:pb-2 lg:pt-2"
            >
              {data.map((item, index) => (
                <MythFacts
                  key={index}
                  image={item.image}
                  myth={item.myth}
                  fact={item.fact}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
