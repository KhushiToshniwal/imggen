

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".right");
  const img = themeToggle.querySelector("img");
  const promptform=document.querySelector(".prompt");
  const promin = document.querySelector(".promptinput");
  const promptbt = document.querySelector(".promptbtn");
   const modelsel=document.getElementById("model")
   const cnt=document.getElementById("imgcount1")
   const rat=document.getElementById("ratios");
   const gridgal=document.querySelector(".gallerygrid");
   
  const examplePrompts = [
    "A futuristic city at sunset with flying cars",
    "A cute baby dragon sitting on a pile of gold",
    "A cyberpunk street with neon lights and rain",
    "A magical forest with glowing mushrooms",
    "A realistic portrait of a warrior princess",
    "A cozy cabin in the snowy mountains",
    "An astronaut relaxing on Mars with a cup of coffee",
    "A fantasy castle floating in the sky",
    "A cat wearing sunglasses riding a skateboard",
    "A peaceful beach during golden hour",
    "A robot cooking in a modern kitchen",
    "A mystical wolf with glowing blue eyes",
    "A steampunk airship flying above clouds",
    "A dark haunted house in the woods",
    "A dreamy pastel aesthetic bedroom",
    "A superhero landing in a dramatic pose",
    "A giant whale flying over a city",
    "A neon-lit gaming room setup",s
    "A fairytale princess in a glowing gown",
    "A dragon flying over a medieval village"
  ];

  (() => {
    const savedTheme = localStorage.getItem("theme");
    const systempreferdark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDarktheme = savedTheme === "dark" || (!savedTheme && systempreferdark);

    document.body.classList.toggle("dark-theme", isDarktheme);
    img.src = isDarktheme ? "sun.jpg" : "bxs-moon.svg";
  })();

  const toggle = () => {
    const isdarktheme = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isdarktheme ? "dark" : "light");
    img.src = isdarktheme ? "sun.jpg" : "bxs-moon.svg";
  };
  const getimagedim=(aspratio,baseSize=512)=>{
    const [width, height] = aspratio.split("/").map(Number);
  const scaleFactor = baseSize / Math.sqrt(width * height);

  let calculatedWidth = Math.round(width * scaleFactor);
  let calculatedHeight = Math.round(height * scaleFactor);

  // Ensure dimensions are multiples of 16
  calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
  calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

  return { width: calculatedWidth, height: calculatedHeight };
   
  };
 const  updateimagecard=(imgindex,imgurl)=>{
  const imgcard=document.getElementById(`imgcard-${imgindex}`);
  if(!imgcard) return;
  imgcard.classList.remove("loading");
  imgcard.innerHTML=`<img src="${imgurl}" 
             alt="" 
             class="resultimg">
             <div class="imgoverlay">
                        <a href="${imgurl}"  class="down" download="${Date.now()}.png">
                          <i class='bx bx-down-arrow-circle'></i>
                        </a>
                    </div>`;

 };
 const generateimage = async (selectedmodel, imgcount, aspratio, prompttext) => {
  const model_url = "http://localhost:3000/generate";
  const { width, height } = getimagedim(aspratio);

  for (let i = 0; i < imgcount; i++) {
    try {
      const response = await fetch(model_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedmodel,
          inputs: prompttext,
          parameters: { width, height },
          options: { wait_for_model: true, use_cache: false },
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      const result = await response.blob();
      updateimagecard(i, URL.createObjectURL(result));

    } catch (error) {
      console.log("Image failed:", error);
    }
  }
};
  const createImagecards = (selectedmodel, imgcount, aspratio, prompttext) => {
  for (let i = 0; i < imgcount; i++) {
    gridgal.innerHTML += `
      <div class="imgcard loading" id="imgcard-${i}" style="aspect-ratio: ${aspratio}">
        <div class="status">
          <div class="spinner"></div>
          <i class='bx bx-error'></i>
          <div class="stattext">
            <p>Generating...</p>
          </div>
        </div>

        
      </div>
    `;
  }
  generateimage(selectedmodel,imgcount,aspratio,prompttext);
};

  
 const hamdleformsubmit=(e)=>{
    e.preventDefault();
    const selectedmodel=modelsel.value;
    
    if (!selectedmodel) {
      alert("Please select a model");
      return;
    }
    //  console.log("Selected Model:", selectedmodel);
    const imgcount =parseInt(cnt.value)||1;
    const aspratio=rat.value||"1/1";
    const prompttext=promin.value.trim();
    createImagecards(selectedmodel,imgcount,aspratio,prompttext);
 }
  promptbt.addEventListener("click", () => {
    const prom = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promin.value = prom; 
    promin.focus();
  });
 
  promptform.addEventListener("submit",hamdleformsubmit);
  themeToggle.addEventListener("click", toggle);
});
