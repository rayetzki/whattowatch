import{j as r,T as a}from"./index-dfad755c.js";import{u as i}from"./Movies-5ebbcdc0.js";const{VITE_API_KEY:s}={VITE_API_KEY:"fd1282bc892320382c1713167a6f886c",VITE_DEFAULT_POSTER_URL:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png",VITE_POSTER_URL:"https://image.tmdb.org/t/p/original",VITE_MOVIE_API:"http://api.themoviedb.org/3/movie/top_rated",VITE_MOVIE_SEARCH_API:"http://api.themoviedb.org/3/search/multi",BASE_URL:"/whattowatch",MODE:"production",DEV:!1,PROD:!0};function m(t,o){const e=new URL(`https://api.themoviedb.org/3/${o?"movie":"tv"}/${t}/videos`);return e.searchParams.set("api_key",s),e.searchParams.set("language","ua"),e.toString()}function p({movie:{id:t,title:o}}){const{results:[{key:e}]}=i(m(t,o));return e?r.jsx("iframe",{width:"100%",height:"360",src:`https://www.youtube.com/embed/${e}`,allow:"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0}):r.jsx(a,{color:"coral",marginBottom:"4",children:"На жаль, трейлера немає"})}export{p as default};