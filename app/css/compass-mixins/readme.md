https://github.com/askucher/compass-sass-mixins

Was previously using:
https://github.com/Igosuki/compass-mixins/
Version: 0.12.10

...but Paul kept on getting the following error:

```
Running "sass:compile" (sass) task
>> Error: Functions may not be defined within control directives or other mixins
.
>>         on line 81 of app/css/compass-mixins/compass/functions/_lists.scss
>> >>   @function compact($vars...) {
>>    --^
Warning:  Used --force, continuing.
Warning: Functions may not be defined within control directives or other mixins.
 Used --force, continuing.
```

Even though this issue said it was fixed:

https://github.com/Igosuki/compass-mixins/issues/84
