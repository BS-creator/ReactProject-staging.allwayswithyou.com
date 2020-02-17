import firebase from 'firebase/app';
import 'firebase/database';
import { toast } from 'react-toastify';
import intl from 'react-intl-universal';
import React from 'react';
import { Radar } from 'recharts';

export function sendVerificationEmail(user) {
	return new Promise((resolve, reject) => {
		user.sendEmailVerification().then(function () {
			var neWverificationSentUserRef = firebase.database().ref('verification-sent').child('user/' + user.uid);
			neWverificationSentUserRef.set({
				uid: user.uid
			}).then(() => {
				toast.success(intl.get('verificationEmailSentTo', {userEmail: user.email}));
				return resolve();
			}).catch(error => {
				return reject(error);
			});
		});
	});
}

export function format24HoursSleepData(sleepData) {
		const newSleepData = [4]
		newSleepData[0] = { formatedSleeps: [] }
		newSleepData[1] = { formatedSleeps: [] }
		newSleepData[2] = { formatedSleeps: [] }
		newSleepData[3] = { formatedSleeps: [] }
		

		sleepData && sleepData.sleeps.forEach(sleep => {
		  switch (sleep.type) {
			case 0:
				getHorizontalChartRow(sleep, '#51BF9D', '#fff', 2 );
			break;
			case 1:
				getHorizontalChartRow(sleep, '#6950A1', '#fff', 3 );
			break;
			case 2:
				getHorizontalChartRow(sleep, '#A6CE39', '#fff', 1 );
			break;
			case 3: 
				getHorizontalChartRow(sleep, '#1B75BC', '#fff', 0 );
			break;
		  }
		});
		function getHorizontalChartRow(sleep, color, defaultColor, index) {
			for( let i = 0 ; i < newSleepData.length ; i++){
				if(i === index){
					newSleepData[i].formatedSleeps.push(
						{
							value: sleep.endTimeInSeconds - sleep.startTimeInSeconds,
							color: color
						}
					)
				} else {
					newSleepData[i].formatedSleeps.push(
						{
							value: sleep.endTimeInSeconds - sleep.startTimeInSeconds,
							color: defaultColor
						}
					)
				}
			}
		}
	return newSleepData;
}

export function formatSleepData(sleepData) {
	sleepData && sleepData.forEach( sleepType => {
		sleepType[intl.get('deep')] = sleepType.deepSleepDurationInSeconds;
		sleepType[intl.get('light')] = sleepType.lightSleepDurationInSeconds;
		sleepType[intl.get('REM')] = sleepType.remSleepDurationInSeconds;
		sleepType[intl.get('awake')] = sleepType.awakeDurationInSeconds;
	});
	return sleepData;
}

export function convertTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	
	return intl.get('timeOfSleep', {hours: hours, minutes: minutes%60});
}

export function sumTime(data) {
	let sum = 0;
	data.forEach( data => {
		sum += data.duration;
	})
	return convertTime(sum);
}

export function renderAssetDiagram(assetType) {
	switch(assetType){
		case 0:
			return <Radar name={intl.get('photos')} dataKey={intl.get('photos')} stroke="#6950a1" fill="#6950a1" fillOpacity={0.6}/>
		case 1:
			return <Radar name={intl.get('videos')} dataKey={intl.get('videos')} stroke="#51bf9d" fill="#51bf9d" fillOpacity={0.6} />
		case 2:
			return <Radar name={intl.get('audios')} dataKey={intl.get('audios')} stroke="#a6ce39" fill="#a6ce39" fillOpacity={0.6}/>
		default: 
			return ''
	}
}

export function formatContentViewData(data) {

	data && data.forEach( uploader => {
		uploader.assetTypeCounts.forEach(upload => {
			uploader[intl.get('videos')] = uploader[intl.get('videos')] ? uploader[intl.get('videos')] : 0;
			uploader[intl.get('photos')] = uploader[intl.get('photos')] ? uploader[intl.get('photos')] : 0;
			uploader[intl.get('audios')] = uploader[intl.get('audios')] ? uploader[intl.get('audios')] : 0;

			switch(getAssetType(upload.assetType)) {
				case 'video':
					uploader[intl.get('videos')] = uploader[intl.get('videos')] + upload.count;
					break;
				case 'image':
					uploader[intl.get('photos')] = uploader[intl.get('photos')] + upload.count;
					break;
				case 'audio':
					uploader[intl.get('audios')] = uploader[intl.get('audios')] + upload.count;
					break;
				default: 
					''
			}
		})
	});
	return data;
}

export function getAssetType(string) {
	const splittedText = string.split('/');
	return splittedText[0];
}

export function calculateStartTimeForContentView (interval) {
	const date = new Date();
	switch(interval){
		case 'last24Hours': 
			date.setHours(date.getHours() - 24);
			break;
		case 'last7Days': 
			date.setDate(date.getDate() - 7);
			break;
		case 'last4Weeks': 
			date.setDate(date.getDate() - 28);
			break;
		case 'last6Months': 
			date.setMonth(date.getMonth() - 6);
			break;
		default:
			''
			break;
	}

	return date;
}

export function cutLongString(string) {
	let arrayOfString = string.split(' ');
	if(arrayOfString[0].length > 7) {
		arrayOfString[0] = arrayOfString[0].substring(0,5) + "...";
	}
	let cuttedString = arrayOfString[0]
	for(var i = 0 ; i < arrayOfString.length ; i++){
		if(i < arrayOfString.length - 1){
			cuttedString = cuttedString + ' ' + arrayOfString[i+1]
		}
	}
	return cuttedString;
}

export function formatContentViewDataForDiagram(data) {
	data.map(element => {
		element.displayName = element.displayName.split(' ')[0];
	});
	return data;
}

export function cutLongName(string) {
	if(string.length > 7) {
		string = string.substring(0,5) + "...";
	}
	return string;
}