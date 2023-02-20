<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />


@Override
public void onReceive(Context context, Intent intent) {
    super.onReceive(context, intent);

    if (intent.getAction().equals("BUTTON_CLICKED")) {
        int appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);

        // Make a network API call
        makeNetworkApiCall(context);

        RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.widget_layout);
        remoteViews.setTextViewText(R.id.text_view, "New Text");

        GlanceAppWidgetManager appWidgetManager = GlanceAppWidgetManager.getInstance(context);
        appWidgetManager.updateAppWidget(appWidgetId, remoteViews);
    }
}

private void makeNetworkApiCall(Context context) {
    // Use the Android Volley library to make the network API call
    String url = "https://my-api-url.com";
    JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url, null,
            response -> {
                // Handle the response from the API call
                String apiResponse = response.toString();
                Log.d(TAG, "API Response: " + apiResponse);
            },
            error -> {
                // Handle the error from the API call
                Log.e(TAG, "API Error: " + error.getMessage());
            });

    // Add the API request to the Volley request queue
    Volley.newRequestQueue(context).add(jsonObjectRequest);
}


dependencies {
    // ...
    implementation 'com.android.volley:volley:1.2.1'
}
