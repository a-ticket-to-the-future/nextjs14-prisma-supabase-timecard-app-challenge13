// import React from 'react'

// const DiffedSubTotal = async () => {


//     // const date= new Date()
//     //         const hours = date.getUTCHours()
//     //         const minutes = date.getUTCMinutes()
//     //         const seconds = date.getSeconds()

//     //         const formattedTime = `${hours}:${minutes}:${seconds}`

//     // const res = await fetch('http://localhost:3000/api/timecard/list',{
//     //     cache:"no-store"
//     // })
//     // const receivedData = await res.json()
//     // console.log(receivedData);

//     // const slicedData = [];
//     // for (let i = 0; i < receivedData.length; i++) {
//     //   slicedData.push(receivedData[i]);
//     // }

//     // console.log(slicedData);

//     // const data = [
//     //     {
//     //       id: "dfa2a24e-6ae5-4fcf-8016-bac3131f429d",
//     //       userId: "f543d8f5-87ed-4a56-ba17-ded7e83ce040",
//     //       startedAt: "2024-03-14T05:27:10.596Z",
//     //       endedAt: "2024-03-14T05:27:12.080Z",
//     //       createdAt: "2024-03-14T05:27:10.597Z",
//     //     },
//     //     // 省略
//     //   ];
      
//     //   // startedAtとendedAtを抽出
//     //   const startedAts = data.map((item) => item.startedAt);
//     //   const endedAts = data.map((item) => item.endedAt);
      
//     //   // 差を計算
//     //   const timeDiffs = endedAts.map((endedAt, index) => {
//     //     const startedAt = startedAts[index];
//     //     // Dateオブジェクトに変換
//     //     const startDate = new Date(startedAt);
//     //     const endDate = new Date(endedAt);
//     //     // ミリ秒単位で差を計算
//     //     const diff = endDate.getTime() - startDate.getTime();
//     //     // 秒に変換
//     //     const seconds = diff / 1000;
//     //     // 時間、分、秒に分割
//     //     const hours = Math.floor(seconds / 3600);
//     //     const minutes = Math.floor((seconds % 3600) / 60);
//     //     const remainingSeconds = Math.floor(seconds % 60);
      
//     //     // 2桁で表示
//     //     const paddedHours = hours.toString().padStart(2, "0");
//     //     const paddedMinutes = minutes.toString().padStart(2, "0");
//     //     const paddedSeconds = remainingSeconds.toString().padStart(2, "0");
      
//     //     // "00:00:00"形式で返す
//     //     return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
//     //   });
      
//     //   // コンソールへ表示
//     //   console.log("timeDiffs:", timeDiffs);
      


//     // const diff2 = convertedEndTime.diff(statedAt,'milliseconds')
//     // console.log(diff2)
//     // // console.log(moment(diff2).add(-9,'hours').format('hh:mm:ss'))
//     // // const diffedTime = moment.tz(diff2,'Asia/Tokyo').format('hh:mm:ss')
//     // // console.log(moment.tz(diff, 'Asia/Tokyo').format('hh:mm:ss'))
//     // // dif2 = moment.tz()
//     // // console.log(diffedTime)
//     // const date= new Date(diff2)
//     // const hours = date.getUTCHours()
//     // const minutes = date.getUTCMinutes()
//     // const seconds = date.getSeconds()

//     // const formattedTime = `${hours}:${minutes}:${seconds}`
//     // console.log(formattedTime);
// }

// export default DiffedSubTotal