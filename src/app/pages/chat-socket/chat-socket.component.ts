import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import * as RecordRTC from "recordrtc";

@Component({
  selector: "app-chat-socket",
  templateUrl: "./chat-socket.component.html",
  styleUrls: ["./chat-socket.component.scss"]
})
export class ChatSocketComponent implements OnInit, AfterViewInit {
  private stream: MediaStream;
  private recordRTC: any;

  @ViewChild("video") video;
  disabled = true;
  style = "";
  fontSize = "";
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    // set the initial state of the video
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = true;
    video.controls = true;
    video.autoplay = false;
  }

  toggleControls() {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = video.muted;
    console.log(video.muted);

    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }

  successCallback(stream: MediaStream) {
    var options = {
      mimeType: "video/webm", // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    let video: HTMLVideoElement = this.video.nativeElement;
    var binaryData = [];
    binaryData.push(video);
    console.log(binaryData);
    video.src = window.URL.createObjectURL(new Blob(binaryData, { type: "application/zip" }));
    this.toggleControls();
  }

  errorCallback() {
    //handle error here
  }

  processVideo(audioVideoWebMURL) {
    let video: HTMLVideoElement = this.video.nativeElement;
    let recordRTC = this.recordRTC;
    video.src = audioVideoWebMURL;
    this.toggleControls();
    var recordedBlob = recordRTC.getBlob();
    recordRTC.getDataURL(function(dataURL) {});
  }

  startRecording() {
    let mediaConstraints = {
      video: true,
      audio: true
    };
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  stopRecording() {
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
  }

  download() {
    this.recordRTC.save("video.webm");
  }
}
