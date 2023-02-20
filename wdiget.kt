public class MyWidgetProvider extends GlanceAppWidgetProvider {

    @Override
    public void onUpdate(Context context, GlanceAppWidgetManager appWidgetManager, int[] appWidgetIds) {

        for (int appWidgetId : appWidgetIds) {

            RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.widget_layout);

            // Set up the TextView and Button widgets
            remoteViews.setTextViewText(R.id.text_view, "Initial Text");
            remoteViews.setOnClickPendingIntent(R.id.button, getPendingSelfIntent(context, appWidgetId));

            // Set the RemoteViews object as the widget's layout
            appWidgetManager.updateAppWidget(appWidgetId, remoteViews);
        }
    }

    private PendingIntent getPendingSelfIntent(Context context, int appWidgetId) {
        Intent intent = new Intent(context, getClass());
        intent.setAction("BUTTON_CLICKED");
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
        return PendingIntent.getBroadcast(context, appWidgetId, intent, 0);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        if (intent.getAction().equals("BUTTON_CLICKED")) {
            int appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);

            RemoteViews remoteViews = new RemoteViews(context.getPackageName(), R.layout.widget_layout);
            remoteViews.setTextViewText(R.id.text_view, "New Text");

            GlanceAppWidgetManager appWidgetManager = GlanceAppWidgetManager.getInstance(context);
            appWidgetManager.updateAppWidget(appWidgetId, remoteViews);
        }
    }
}
