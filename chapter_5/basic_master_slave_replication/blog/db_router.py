class PrimaryReplicaRouter:
    def db_for_read(self, model, **hints):
        """
        Reads go to replica.
        """
        return 'replica'

    def db_for_write(self, model, **hints):
        """
        Writes always go to default (master).
        """
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Relations between objects are allowed.
        """
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        All migrations go to master.
        """
        return db == 'default' 